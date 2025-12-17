import {
    ScriptEventCommandMessageAfterEvent,
    system,
    world,
} from "@minecraft/server";
import {http, HttpHeader, HttpRequest, HttpRequestMethod} from "@minecraft/server-net";
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
import {IsIMcApiRIdPacket} from "./API/Network/McApiPackets/IMcApiRIdPacket";
import {McApiPingRequestPacket} from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
import {McApiPingResponsePacket} from "./API/Network/McApiPackets/Response/McApiPingResponsePacket";
import {McHttpUpdatePacket} from "./Packets/McHttpUpdatePacket";

export class McApiMcHttp {
    private _version: Version = new Version(1, 1, 0);
    private _cm: CommandManager = new CommandManager(this);
    private _defaultTimeoutMs: number = 10000;

    //Connection state objects.
    private _hostname?: string = undefined;
    private _token?: string = undefined;
    private _pinger?: number = undefined;
    private _updater?: number = undefined;
    private _writer: NetDataWriter = new NetDataWriter();
    private _reader: NetDataReader = new NetDataReader();
    private _lastPing: number = 0;
    private _connectionState: 0 | 1 | 2 | 3 = 0; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
    private _requestIds: Set<string> = new Set<string>();

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

    public async ConnectAsync(hostname: string, token: string) {
        if (this._connectionState !== 0)
            throw new Error("Already in connecting/connected state!");

        try {
            this.StopHttpUpdater();
            this._hostname = hostname;
            this._connectionState = 1;
            this._requestIds.clear();
            this.OutboundQueue.clear();
            this.StartHttpUpdater();
            const packet = new McApiLoginRequestPacket(
                Guid.Create().toString(),
                token,
                this._version
            );
            if (this.RegisterRequestId(packet.RequestId)) {
                this.SendPacket(packet);
                const response = await this.GetResponseAsync(packet.RequestId);
                if (response instanceof McApiAcceptResponsePacket) {
                    this._token = response.Token;
                    this._lastPing = Date.now();
                    try {
                        system.sendScriptEvent(
                            `${VoiceCraft.Namespace}:onConnected`,
                            response.Token
                        );
                    } catch {
                        //Do Nothing
                    }
                } else if (response instanceof McApiDenyResponsePacket) {
                    throw new Error(response.Reason);
                }

                this.StartPinger();
                this._connectionState = 2;
            }
        } catch (ex) {
            this._connectionState = 0;
            this.OutboundQueue.clear();
            throw ex;
        }
    }

    public Disconnect(reason?: string) {
        if (this._connectionState !== 2) return;
        this._connectionState = 3;
        if (this._pinger !== undefined) system.clearRun(this._pinger);
        this.OutboundQueue.clear();
        if(this._token !== undefined)
            this.SendPacket(new McApiLogoutRequestPacket(this._token));
        this._connectionState = 0;
        this._hostname = undefined;
        this._token = undefined;

        world.translateMessage(Locales.VcMcApi.Status.Disconnected, {
            rawtext: [
                {
                    translate: reason ?? Locales.VcMcApi.DisconnectReason.None,
                },
            ],
        });
        system.sendScriptEvent(
            `${VoiceCraft.Namespace}:onDisconnected`,
            reason ?? Locales.VcMcApi.DisconnectReason.None
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

    private StartHttpUpdater() {
        this.StopHttpUpdater();
        this._updater = system.runInterval(async () => this.HttpUpdaterLogic());
    }

    private StartPinger() {
        this.StopPinger();
        this._pinger = system.runInterval(
            () => this.PingIntervalLogic(),
            Math.round(this._defaultTimeoutMs / 4 / 20)
        );
    }

    private StopHttpUpdater() {
        if (this._updater !== undefined) {
            system.clearRun(this._updater);
            this._pinger = undefined;
        }
    }

    private StopPinger() {
        if (this._pinger !== undefined) {
            system.clearRun(this._pinger);
            this._pinger = undefined;
        }
    }

    private RegisterRequestId(requestId: string): boolean {
        if (this._requestIds.has(requestId)) return false;
        this._requestIds.add(requestId);
        return true;
    }

    private DeregisterRequestId(requestId: string): boolean {
        return this._requestIds.delete(requestId);
    }

    private async GetResponseAsync(
        requestId: string,
        timeout: number = this._defaultTimeoutMs
    ): Promise<IMcApiPacket> {
        let callbackData: IMcApiPacket | undefined = undefined;
        const callback = this.OnPacket.Subscribe((data) => {
            if (IsIMcApiRIdPacket(data) && data.RequestId === requestId) {
                this.DeregisterRequestId(requestId);
                callbackData = data;
            }
        });

        try {
            const expiryTime = Date.now() + timeout;
            while (expiryTime > Date.now()) {
                if (callbackData !== undefined) return callbackData;
                await system.waitTicks(1);
            }

            throw new Error(Locales.VcMcApi.DisconnectReason.Timeout);
        } finally {
            this.DeregisterRequestId(requestId);
            this.OnPacket.Unsubscribe(callback);
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

    private async HttpUpdaterLogic() {
        if (this._hostname === undefined || this._connectionState === 0) {
            this.StopHttpUpdater();
            return;
        }

        const requestPacket = new McHttpUpdatePacket();
        let packet = this.OutboundQueue.dequeue();
        while (packet !== undefined) {
            requestPacket.Packets.push(Z85.GetStringWithPadding(packet));
            packet = this.OutboundQueue.dequeue();
        }

        const request = new HttpRequest(this._hostname);
        request.setBody(JSON.stringify(requestPacket));
        request.setMethod(HttpRequestMethod.POST);
        request.setHeaders([
            new HttpHeader('Content-Type', 'application/json'),
            new HttpHeader('Authorization', `Bearer ${this._token}`)
        ]);
        const response = await http.request(request);

        if (response.status !== 200) return;
        const responsePacket = Object.assign(new McHttpUpdatePacket(), JSON.parse(response.body));
        for (const packet of responsePacket.Packets) {
            await this.ReceivePacketAsync(packet);
        }
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
    }

    private HandleDenyResponsePacket(packet: McApiDenyResponsePacket) {
        this.OnPacket.Invoke(packet);
    }

    private HandlePingResponsePacket(packet: McApiPingResponsePacket) {
        this.OnPacket.Invoke(packet);
        this._lastPing = Date.now();
    }
}
