import {ScriptEventCommandMessageAfterEvent, system, world,} from "@minecraft/server";
import {Version} from "./API/Data/Version";
import {VoiceCraft} from "./API/VoiceCraft";
import {NetDataWriter} from "./API/Network/NetDataWriter";
import {NetDataReader} from "./API/Network/NetDataReader";
import {CommandManager} from "./Managers/CommandManager";
import {Guid} from "./API/Data/Guid";
import {McApiPacketType} from "./API/Data/Enums";
import {Event} from "./API/Event";
import {Queue} from "./API/Data/Queue";
import {Locales} from "./API/Locales";
import {Z85} from "./API/Encoders/Z85";
import "./Extensions";
import {IMcApiPacket} from "./API/Network/McApiPackets/IMcApiPacket";
import {McApiLoginRequestPacket} from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import {McApiAcceptResponsePacket} from "./API/Network/McApiPackets/Response/McApiAcceptResponsePacket";
import {McApiDenyResponsePacket} from "./API/Network/McApiPackets/Response/McApiDenyResponsePacket";
import {McApiLogoutRequestPacket} from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import {McApiPingRequestPacket} from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
import {McApiPingResponsePacket} from "./API/Network/McApiPackets/Response/McApiPingResponsePacket";

export class McApiMcwss {
    private _version: Version = new Version(1, 1, 0);
    private _cm: CommandManager = new CommandManager(this);
    private _defaultTimeoutMs: number = 10000;

    //Connection state objects.
    private _token?: string = undefined;
    private _pinger?: number = undefined;
    private _writer: NetDataWriter = new NetDataWriter();
    private _reader: NetDataReader = new NetDataReader();
    private _lastPing: number = 0;
    private _connectionState: 0 | 1 | 2 | 3 = 0; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
    private _disconnectReason? = undefined;

    //Data
    public get Token(): string | undefined { return this._token; }

    //Queue
    public OutboundQueue: Queue<Uint8Array> = new Queue<Uint8Array>();

    //McApi
    public OnPacket: Event<IMcApiPacket> = new Event<IMcApiPacket>();

    constructor() {
        system.afterEvents.scriptEventReceive.subscribe((ev) =>
            this.HandleScriptEventAsync(ev)
        );
    }

    private async HandleScriptEventAsync(
        ev: ScriptEventCommandMessageAfterEvent
    ) {
        switch (ev.id) {
            case `${VoiceCraft.Namespace}:sendPacket`:
                await this.HandleSendPacketEventAsync(ev.message);
                break;
        }
    }

    private async HandleSendPacketEventAsync(packet: string) {
        if (this._connectionState !== 2) return; //Not connected or we've got too many packets.
        const packetData = Z85.GetBytesWithPadding(packet);
        if (packetData.length <= 0) return;
        this._reader.SetBufferSource(packetData);
        const packetType = this._reader.GetByte();
        if (
            packetType < McApiPacketType.LoginRequest ||
            packetType > McApiPacketType.OnEntityAudioReceived
        )
            return; //Not a valid packet

        this.OutboundQueue.enqueue(this._reader.CopyData());
    }

    public async ConnectAsync(token: string) {
        if (this._connectionState !== 0)
            throw new Error("Already in connecting/connected state!");

        this._connectionState = 1;
        this.OutboundQueue.clear();
        const packet = new McApiLoginRequestPacket(
            Guid.Create().toString(),
            token,
            this._version
        );
        this.SendPacket(packet);
        const expiryTime = Date.now() + this._defaultTimeoutMs;
        while (this._connectionState === 1) {
            if (Date.now() > expiryTime) {
                this._connectionState = 0;
                this.OutboundQueue.clear();
                throw new Error(Locales.VcMcApi.DisconnectReason.Timeout)
            }
            await system.waitTicks(1);
        }
        if (this._connectionState !== 2) {
            this._connectionState = 0;
            this.OutboundQueue.clear();
            throw new Error(this._disconnectReason ?? Locales.VcMcApi.DisconnectReason.Manual);
        }

        this.StartPinger();
        this._connectionState = 2;
    }

    public Disconnect(reason?: string) {
        if (this._connectionState !== 2) return;
        this._connectionState = 3;
        this.StopPinger();
        this.OutboundQueue.clear();
        if(this._token !== undefined)
            this.SendPacket(new McApiLogoutRequestPacket(this._token));
        this._connectionState = 0;
        this._token = undefined;

        world.translateMessage(Locales.VcMcApi.Status.Disconnected, {
            rawtext: [
                {
                    translate: reason ?? Locales.VcMcApi.DisconnectReason.Manual,
                },
            ],
        });
        system.sendScriptEvent(
            `${VoiceCraft.Namespace}:onDisconnected`,
            reason ?? Locales.VcMcApi.DisconnectReason.Manual
        );
    }

    public SendPacket(packet: IMcApiPacket) {
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        packet.Serialize(this._writer); //Serialize
        this.OutboundQueue.enqueue(this._writer.CopyData());
    }

    public async ReceivePacketAsync(packet: string) {
        try {
            const packetData = Z85.GetBytesWithPadding(packet);
            if (packetData.length <= 0) return;

            this._reader.SetBufferSource(packetData);
            const packetType = this._reader.GetByte();
            if (
                packetType < McApiPacketType.LoginRequest ||
                packetType > McApiPacketType.OnEntityAudioReceived
            )
                return; //Not a valid packet.
            system.sendScriptEvent(`${VoiceCraft.Namespace}:onPacket`, packet);
            await this.HandlePacketAsync(packetType as McApiPacketType, this._reader);
        } catch (ex) {
            console.error(ex);
        }
    }

    private StartPinger() {
        this.StopPinger();
        this._pinger = system.runInterval(
            () => this.PingIntervalLogic(),
            Math.round(this._defaultTimeoutMs / 4 / 20)
        );
    }

    private StopPinger() {
        if (this._pinger !== undefined) {
            system.clearRun(this._pinger);
            this._pinger = undefined;
        }
    }

    private async PingIntervalLogic() {
        if (this._connectionState !== 2) {
            this.StopPinger();
            return;
        }
        if (Date.now() - this._lastPing >= this._defaultTimeoutMs)
            this.Disconnect(Locales.VcMcApi.DisconnectReason.Timeout);
        this.SendPacket(new McApiPingRequestPacket());
    }

    private async HandlePacketAsync(
        packetType: McApiPacketType,
        reader: NetDataReader
    ) {
        switch (packetType) {
            case McApiPacketType.AcceptResponse:
                const acceptResponsePacket = new McApiAcceptResponsePacket();
                acceptResponsePacket.Deserialize(reader);
                this.HandleAcceptResponsePacket(acceptResponsePacket);
                break;
            case McApiPacketType.DenyResponse:
                const denyResponsePacket = new McApiDenyResponsePacket();
                denyResponsePacket.Deserialize(reader);
                this.HandleDenyResponsePacket(denyResponsePacket);
                break;
            case McApiPacketType.PingResponse:
                const pingResponsePacket = new McApiPingResponsePacket();
                pingResponsePacket.Deserialize(reader);
                this.HandlePingResponsePacket(pingResponsePacket);
                break;
        }
    }

    private HandleAcceptResponsePacket(packet: McApiAcceptResponsePacket) {
        this.OnPacket.Invoke(packet);
        if (this._connectionState === 1) {
            this._connectionState = 2;
            this._token = packet.Token;
            this._lastPing = Date.now();
            try {
                system.sendScriptEvent(
                    `${VoiceCraft.Namespace}:onConnected`,
                    packet.Token);
            } catch {
                //Do Nothing
            }
        }
    }

    private HandleDenyResponsePacket(packet: McApiDenyResponsePacket) {
        this.OnPacket.Invoke(packet);
        if (this._connectionState === 1) {
            this._connectionState = 0;
            this._token = undefined;
            this.OutboundQueue.clear();
        }
    }

    private HandlePingResponsePacket(packet: McApiPingResponsePacket) {
        this.OnPacket.Invoke(packet);
        this._lastPing = Date.now();
    }
}
