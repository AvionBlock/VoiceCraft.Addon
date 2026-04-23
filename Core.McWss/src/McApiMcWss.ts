import "./Extensions";
import {CommandManager} from "./Managers/CommandManager";
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
import {McApiConnectionState, McApiPacketType} from "./API/Data/Enums";
import {Guid} from "./API/Data/Guid";
import {McApiLoginRequestPacket} from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import {VoiceCraft} from "./API/VoiceCraft";
import {Locales} from "./API/Locales";
import {McApiLogoutRequestPacket} from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import {IMcApiPacket} from "./API/Network/McApiPackets/IMcApiPacket";
import {Z85} from "./API/Encoders/Z85";
import {McApiPingRequestPacket} from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
import {IMcApiRIdPacket} from "./API/Network/McApiPackets/IMcApiRIdPacket";
import {McApiAcceptResponsePacket} from "./API/Network/McApiPackets/Response/McApiAcceptResponsePacket";

export class McApiMcWss extends McApiClient {
    private _timeoutMs: number = 10000;
    private _pinger: number | undefined;
    private readonly _mcWssWriter: NetDataWriter = new NetDataWriter();
    private readonly _mcWssReader: NetDataReader = new NetDataReader();
    private readonly _writer: NetDataWriter = new NetDataWriter();
    private readonly _reader: NetDataReader = new NetDataReader();

    constructor() {
        super();
        new CommandManager(this);

        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            switch (ev.id) {
                case `${VoiceCraft.Namespace}:sendPacket`:
                    if (this.ConnectionState !== McApiConnectionState.Connected) return;
                    this.OutboundQueue.enqueue(Z85.GetBytesWithPadding(ev.message));
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
                        {name: "max_byte_length", type: CustomCommandParamType.Integer},
                        {name: "data", type: CustomCommandParamType.String},
                    ],
                },
                (origin, maxByteLength, data) => this.HandleDataTunnelCommand(origin, maxByteLength, data)
            );
        });
    }


    public override async ConnectAsync(_: string, __: number, loginToken: string): Promise<void> {
        if (this.ConnectionState !== McApiConnectionState.Disconnected) return;
        this.ConnectionState = McApiConnectionState.Connecting;
        this.Reset();

        const requestId = Guid.Create().toString();
        const packet = new McApiLoginRequestPacket(requestId, loginToken, VoiceCraft.Version);
        try {
            this._writer.Reset();
            this._writer.PutByte(packet.PacketType);
            this._writer.PutPacket(packet);
            this.OutboundQueue.enqueue(this._writer.CopyData());
            const response = await this.GetResponseAsync<McApiAcceptResponsePacket, string>(
                McApiPacketType.AcceptResponse,
                requestId,
                response => response.Token,
                160
            )
            this.ConnectionState = McApiConnectionState.Connected;
            this._pinger = system.runInterval(() => {
                if (this.ConnectionState === McApiConnectionState.Connected) {
                    this.SendPacket(new McApiPingRequestPacket());
                }
            }, 20);
            this.Token = packet.Token;
            this.ConnectionState = McApiConnectionState.Connected;
            this.OnConnected?.Invoke(response);
        } catch (ex) {
            let error = "";
            if (ex instanceof Error) {
                error = ex.message;
            }
            await this.DisconnectAsync(error, true).then();
            throw ex;
        }
    }

    public override Update(): void {
        if (this.ConnectionState === McApiConnectionState.Disconnected) {
            return;
        }

        if (Date.now() - this.LastPing >= this._timeoutMs &&
            this.ConnectionState !== McApiConnectionState.Disconnecting &&
            this.ConnectionState !== McApiConnectionState.Connecting) {
            this.DisconnectAsync(Locales.VcMcApi.DisconnectReason.Timeout, true).then();
            return;
        }

        let packet = this.InboundQueue.dequeue();
        while (packet !== undefined) {
            try {
                this._reader.Clear();
                this._reader.SetBufferSource(packet);
                this.ProcessPacket(this._reader, (mcApiPacket) => {
                    this.LastPing = Date.now();
                    if (!this.AuthorizePacket(mcApiPacket, this.Token ?? "")) return;
                    this.ExecutePacket(mcApiPacket);
                });
            } catch {
                //Do Nothing
            }
            packet = this.InboundQueue.dequeue();
        }
    }

    public async DisconnectAsync(reason?: string, force?: boolean): Promise<void> {
        if (this.ConnectionState === McApiConnectionState.Disconnected ||
            this.ConnectionState === McApiConnectionState.Disconnecting) return;

        if (force) {
            this.Reset();
            this.ConnectionState = McApiConnectionState.Disconnected;
            this.OnDisconnected.Invoke(reason ?? Locales.VcMcApi.DisconnectReason.Manual);
            return;
        }

        this.ConnectionState = McApiConnectionState.Disconnecting;
        this.SendPacket(new McApiLogoutRequestPacket(this.Token ?? ""));

        while (this.ConnectionState === McApiConnectionState.Disconnecting) {
            await system.waitTicks(1);
        }

        this.Reset();
        this.OnDisconnected.Invoke(reason ?? Locales.VcMcApi.DisconnectReason.Manual);
    }

    public override SendPacket(packet: IMcApiPacket): boolean {
        if (this.ConnectionState === McApiConnectionState.Disconnected ||
            this.ConnectionState === McApiConnectionState.Disconnecting) return false;
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        this._writer.PutPacket(packet);
        this.OutboundQueue.enqueue(this._writer.CopyData());
        return true;
    }

    private Reset(): void {
        this.Token = undefined;
        this.LastPing = 0;
        this.OutboundQueue.clear();
        this.InboundQueue.clear();
        if (this._pinger !== undefined)
            system.clearRun(this._pinger);
    }

    private async GetResponseAsync<TPacket extends IMcApiPacket & IMcApiRIdPacket, TResult>(
        packetType: McApiPacketType,
        requestId: string,
        selector: (packet: TPacket) => TResult,
        timeoutTicks: number,
        token?: AbortSignal
    ): Promise<TResult> {
        const tcs = Promise.withResolvers<TResult>();
        const dTcs = Promise.withResolvers<string | undefined>();
        const timeoutId = system.runTimeout(() => {
            tcs.reject(new Error("TimeoutException"));
        }, timeoutTicks);
        if (token !== undefined)
            token.onabort = (_) => tcs.reject(new Error("OperationCanceledException"));

        this.OnPacketReceived.Subscribe(EventCallback);
        this.OnDisconnected.Subscribe(OnDisconnectedCallback);

        try {
            let result: TResult | undefined;
            let disconnectResult: string | undefined;
            await Promise.race([
                tcs.promise.then(x => {
                    result = x;
                }),
                dTcs.promise.then(x => {
                    disconnectResult = x;
                })
            ]);
            if (result !== undefined)
                return result;
            throw new Error(disconnectResult ?? "Disconnected");

        } finally {
            system.clearRun(timeoutId);
            if (token !== undefined)
                token.onabort = null;
            this.OnPacketReceived.Unsubscribe(EventCallback);
            this.OnDisconnected.Unsubscribe(OnDisconnectedCallback);
        }

        function EventCallback(packet: IMcApiPacket) {
            if (packet.PacketType === packetType && "RequestId" in packet && packet.RequestId === requestId)
                try {
                    tcs.resolve(selector(packet as TPacket));
                } catch (err) {
                    tcs.reject(err);
                }
        }

        function OnDisconnectedCallback(reason: string | undefined) {
            dTcs.resolve(reason);
        }
    }

    private HandleDataTunnelCommand(_: CustomCommandOrigin, maxByteLength: number, data: string): CustomCommandResult {
        this.ReceivePacketsLogic(data);
        return {status: CustomCommandStatus.Success, message: this.SendPacketsLogic(maxByteLength)};
    }

    private SendPacketsLogic(maxByteLength: number): string | undefined {
        let packetData = this.OutboundQueue.dequeue();
        this._mcWssWriter.Reset();

        while (this._mcWssWriter.Length < maxByteLength && packetData !== undefined) {
            this._mcWssWriter.PutUshort(packetData.length);
            this._mcWssWriter.PutBytes(packetData, 0, packetData.length);
            packetData = this.OutboundQueue.dequeue();
        }
        return Z85.GetStringWithPadding(this._mcWssWriter.CopyData()).replaceAll("%", "%%");
    }

    private ReceivePacketsLogic(data: string): void {
        if (data.length <= 0) return;
        const packedPackets = Z85.GetBytesWithPadding(data);
        this._mcWssReader.Clear();
        this._mcWssReader.SetBufferSource(packedPackets);
        while (!this._mcWssReader.EndOfData) {
            const size = this._mcWssReader.GetUshort();
            try {
                if (size <= 0) continue;
                const data = new Uint8Array(size);
                this._mcWssReader.GetBytes(data, size);
                this.InboundQueue.enqueue(data);
            } catch {
                //Do Nothing
            }
        }
    }
}
