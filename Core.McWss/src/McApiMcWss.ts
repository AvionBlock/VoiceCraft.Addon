import "./Extensions";
import {CommandManager} from "./Managers/CommandManager";
import {Queue} from "./API/Data/Queue";
import {NetDataWriter} from "./API/Data/NetDataWriter";
import {NetDataReader} from "./API/Data/NetDataReader";
import {McApiClient} from "./API/McApiClient";
import {
    CommandPermissionLevel,
    CustomCommandOrigin,
    CustomCommandParamType,
    CustomCommandResult,
    CustomCommandStatus,
    system
} from "@minecraft/server";
import {McApiConnectionState} from "./API/Data/Enums";
import {Guid} from "./API/Data/Guid";
import {McApiLoginRequestPacket} from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import {VoiceCraft} from "./API/VoiceCraft";
import {Locales} from "./API/Locales";
import {McApiLogoutRequestPacket} from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import {IMcApiPacket} from "./API/Network/McApiPackets/IMcApiPacket";
import {Z85} from "./API/Encoders/Z85";
import {McApiPingRequestPacket} from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";

export class McApiMcWss extends McApiClient {
    private _cm: CommandManager = new CommandManager(this);
    private _timeoutMs: number = 10000;
    private _lastPingPacket: number = 0;
    private _updater: number | undefined;
    private _outboundQueue: Queue<string> = new Queue<string>();
    private readonly _writer: NetDataWriter = new NetDataWriter();
    private readonly _reader: NetDataReader = new NetDataReader();

    constructor() {
        super();

        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            switch(ev.id)
            {
                case `${VoiceCraft.Namespace}:sendPacket`:
                    if (this.ConnectionState != McApiConnectionState.Connected) return;
                    this._outboundQueue.enqueue(ev.message);
                    break;
            }
        });
        system.beforeEvents.startup.subscribe((ev) => {
            const registry = ev.customCommandRegistry;
            registry.registerCommand(
                {
                    name: `${VoiceCraft.Namespace}:data_tunnel`,
                    description: "Data transfer tunnel between servers",
                    permissionLevel: CommandPermissionLevel.Host,
                    optionalParameters: [
                        {name: "max_string_length", type: CustomCommandParamType.Integer},
                        {name: "data", type: CustomCommandParamType.String},
                    ],
                },
                (origin, maxStringLength, data) => this.HandleDataTunnelCommand(origin, maxStringLength, data)
            );
        });
    }


    public async ConnectAsync(ip: string, _: number, loginToken: string): Promise<void> {
        if (this.ConnectionState != McApiConnectionState.Disconnected) return;
        this.ConnectionState = McApiConnectionState.Connecting;
        this.Token = undefined;
        this.LastPing = 0;
        this._lastPingPacket = 0;
        this._outboundQueue.clear();
        this.StopUpdater();
        this.StartUpdater();

        const requestId = Guid.Create().toString();
        const packet = new McApiLoginRequestPacket(requestId, loginToken, VoiceCraft.Version);
        try {
            this.SendPacket(packet);
            const startTime = Date.now();
            while (this.ConnectionState == McApiConnectionState.Connecting) {
                await system.waitTicks(1);
                if (Date.now() - startTime >= this._timeoutMs) {
                    await this.DisconnectAsync(Locales.VcMcApi.DisconnectReason.Timeout, true);
                    return;
                }
            }
        } catch (ex) {
            await this.DisconnectAsync(`${ex}`, true);
        }
    }

    public async DisconnectAsync(reason?: string, force: boolean = false): Promise<void> {
        if (this.ConnectionState == McApiConnectionState.Disconnected ||
            this.ConnectionState == McApiConnectionState.Disconnecting) return;

        if (force) {
            this.ConnectionState = McApiConnectionState.Disconnected;
            this.OnDisconnected.Invoke(reason);
            system.sendScriptEvent(`${VoiceCraft.Namespace}:onDisconnected`, reason ?? Locales.VcMcApi.DisconnectReason.Manual);
            return;
        }

        this.SendPacket(new McApiLogoutRequestPacket(this.Token ?? ""));
        this.ConnectionState = McApiConnectionState.Disconnecting;

        while (this.ConnectionState == McApiConnectionState.Disconnecting) {
            await system.waitTicks(1);
        }
        this.ConnectionState = McApiConnectionState.Disconnected;
        this.OnDisconnected.Invoke(reason);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onDisconnected`, reason ?? Locales.VcMcApi.DisconnectReason.Manual);
    }

    public override SendPacket(packet: IMcApiPacket): boolean {
        if (this.ConnectionState == McApiConnectionState.Disconnected ||
            this.ConnectionState == McApiConnectionState.Disconnecting) return false;
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        this._writer.PutPacket(packet);
        this._outboundQueue.enqueue(Z85.GetStringWithPadding(this._writer.CopyData()))
        return true;
    }

    private StartUpdater(): void {
        this._updater = system.runInterval(async () => await this.McWssUpdaterLogic());
    }

    private StopUpdater(): void {
        if (this._updater == undefined) return;
        system.clearRun(this._updater);
    }

    private async McWssUpdaterLogic() {
        try {
            if (this.ConnectionState == McApiConnectionState.Disconnected) {
                this.StopUpdater();
                return;
            }
            if (Date.now() - this.LastPing >= this._timeoutMs &&
                this.ConnectionState != McApiConnectionState.Disconnecting &&
                this.ConnectionState != McApiConnectionState.Connecting) {
                this.DisconnectAsync(Locales.VcMcApi.DisconnectReason.Timeout, true).then();
                this.StopUpdater();
                return;
            }
            if (Date.now() - this._lastPingPacket >= this._timeoutMs / 8 &&
                this.ConnectionState == McApiConnectionState.Connected) {
                this.SendPacket(new McApiPingRequestPacket());
                this._lastPingPacket = Date.now();
            }
        } catch (ex) {
            console.error(ex);
            //Do Nothing.
        }
    }

    private HandleDataTunnelCommand(_: CustomCommandOrigin, maxStringLength: number, data: string): CustomCommandResult {
        system.run(() => {
            this.ReceivePacketsLogic(data);
        });
        return {status: CustomCommandStatus.Success, message: this.SendPacketsLogic(maxStringLength)};
    }

    private SendPacketsLogic(maxStringLength: number): string | undefined {
        let stringData = "";
        let packetData = this._outboundQueue.dequeue();
        if (packetData === undefined) return stringData;
        stringData = packetData;

        while (stringData.length < maxStringLength) {
            packetData = this._outboundQueue.dequeue();
            if (packetData == undefined)
                break;
            stringData += `|${packetData}`;
        }
        return stringData.replaceAll("%", "%%");
    }

    private ReceivePacketsLogic(data: string): void {
        const packets = data.split('|');
        for (const packetString of packets) {
            if(packetString.length <= 0) continue;
            const source = Z85.GetBytesWithPadding(packetString);
            this._reader.SetBufferSource(source);
            this.ProcessPacket(this._reader, (packet) => {
                this.LastPing = Date.now();
                system.sendScriptEvent(`${VoiceCraft.Namespace}:onPacket`, packetString);
                this.ExecutePacket(packet);
            });
        }
    }
}
