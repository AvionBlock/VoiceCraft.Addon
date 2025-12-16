import { system, world, } from "@minecraft/server";
import { Version } from "./API/Data/Version";
import { VoiceCraft } from "./API/VoiceCraft";
import { NetDataWriter } from "./API/Network/NetDataWriter";
import { NetDataReader } from "./API/Network/NetDataReader";
import { CommandManager } from "./Managers/CommandManager";
import { Guid } from "./API/Data/Guid";
import { McApiPacketType } from "./API/Data/Enums";
import { Event } from "./API/Event";
import { Queue } from "./API/Data/Queue";
import { Locales } from "./API/Locales";
import { Z85 } from "./API/Encoders/Z85";
import "./Extensions";
import { McApiLoginRequestPacket } from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import { McApiAcceptResponsePacket } from "./API/Network/McApiPackets/Response/McApiAcceptResponsePacket";
import { McApiDenyResponsePacket } from "./API/Network/McApiPackets/Response/McApiDenyResponsePacket";
import { McApiLogoutRequestPacket } from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import { IsIMcApiRIdPacket } from "./API/Network/McApiPackets/IMcApiRIdPacket";
import { McApiPingRequestPacket } from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
import { McApiPingResponsePacket } from "./API/Network/McApiPackets/Response/McApiPingResponsePacket";
export class McApiMcwss {
    _version = new Version(1, 1, 0);
    _cm = new CommandManager(this);
    _defaultTimeoutMs = 10000;
    //Connection state objects.
    _token = undefined;
    _pinger = undefined;
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _lastPing = 0;
    _connectionState = 0; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
    _requestIds = new Set();
    //Data
    get Token() { return this._token; }
    //Queue
    OutboundQueue = new Queue();
    //McApi
    OnPacket = new Event();
    constructor() {
        system.afterEvents.scriptEventReceive.subscribe((ev) => this.HandleScriptEventAsync(ev));
    }
    async HandleScriptEventAsync(ev) {
        switch (ev.id) {
            case `${VoiceCraft.Namespace}:sendPacket`:
                await this.HandleSendPacketEventAsync(ev.message);
                break;
        }
    }
    async HandleSendPacketEventAsync(packet) {
        if (this._connectionState !== 2)
            return; //Not connected or we've got too many packets.
        const packetData = Z85.GetBytesWithPadding(packet);
        if (packetData.length <= 0)
            return;
        this._reader.SetBufferSource(packetData);
        const packetType = this._reader.GetByte();
        if (packetType < McApiPacketType.LoginRequest ||
            packetType > McApiPacketType.OnEntityAudioReceived)
            return; //Not a valid packet
        this.OutboundQueue.enqueue(this._reader.CopyData());
    }
    async ConnectAsync(token) {
        if (this._connectionState !== 0)
            throw new Error("Already in connecting/connected state!");
        try {
            this._connectionState = 1;
            this._requestIds.clear();
            this.OutboundQueue.clear();
            const packet = new McApiLoginRequestPacket(Guid.Create().toString(), token, this._version);
            if (this.RegisterRequestId(packet.RequestId)) {
                this.SendPacket(packet);
                const response = await this.GetResponseAsync(packet.RequestId);
                if (response instanceof McApiAcceptResponsePacket) {
                    this._token = response.Token;
                    this._lastPing = Date.now();
                    try {
                        system.sendScriptEvent(`${VoiceCraft.Namespace}:onConnected`, response.Token);
                    }
                    catch {
                        //Do Nothing
                    }
                }
                else if (response instanceof McApiDenyResponsePacket) {
                    throw new Error(response.Reason);
                }
                this.StartPinger();
                this._connectionState = 2;
            }
        }
        catch (ex) {
            this._connectionState = 0;
            this.OutboundQueue.clear();
            throw ex;
        }
    }
    Disconnect(reason) {
        if (this._connectionState !== 2)
            return;
        this._connectionState = 3;
        if (this._pinger !== undefined)
            system.clearRun(this._pinger);
        this.OutboundQueue.clear();
        if (this._token !== undefined)
            this.SendPacket(new McApiLogoutRequestPacket(this._token));
        this._connectionState = 0;
        this._token = undefined;
        world.translateMessage(Locales.VcMcApi.Status.Disconnected, {
            rawtext: [
                {
                    translate: reason ?? Locales.VcMcApi.DisconnectReason.None,
                },
            ],
        });
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onDisconnected`, reason ?? Locales.VcMcApi.DisconnectReason.None);
    }
    SendPacket(packet) {
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        packet.Serialize(this._writer); //Serialize
        this.OutboundQueue.enqueue(this._writer.CopyData());
    }
    async ReceivePacketAsync(packet) {
        try {
            const packetData = Z85.GetBytesWithPadding(packet);
            if (packetData.length <= 0)
                return;
            this._reader.SetBufferSource(packetData);
            const packetType = this._reader.GetByte();
            if (packetType < McApiPacketType.LoginRequest ||
                packetType > McApiPacketType.OnEntityAudioReceived)
                return; //Not a valid packet.
            system.sendScriptEvent(`${VoiceCraft.Namespace}:onPacket`, packet);
            await this.HandlePacketAsync(packetType, this._reader);
        }
        catch (ex) {
            console.error(ex);
        }
    }
    StartPinger() {
        this.StopPinger();
        this._pinger = system.runInterval(() => this.PingIntervalLogic(), Math.round(this._defaultTimeoutMs / 4 / 20));
    }
    StopPinger() {
        if (this._pinger !== undefined) {
            system.clearRun(this._pinger);
            this._pinger = undefined;
        }
    }
    RegisterRequestId(requestId) {
        if (this._requestIds.has(requestId))
            return false;
        this._requestIds.add(requestId);
        return true;
    }
    DeregisterRequestId(requestId) {
        return this._requestIds.delete(requestId);
    }
    async GetResponseAsync(requestId, timeout = this._defaultTimeoutMs) {
        let callbackData = undefined;
        const callback = this.OnPacket.Subscribe((data) => {
            if (IsIMcApiRIdPacket(data) && data.RequestId === requestId) {
                this.DeregisterRequestId(requestId);
                callbackData = data;
            }
        });
        try {
            const expiryTime = Date.now() + timeout;
            while (expiryTime > Date.now()) {
                if (callbackData !== undefined)
                    return callbackData;
                await system.waitTicks(1);
            }
            throw new Error(Locales.VcMcApi.DisconnectReason.Timeout);
        }
        finally {
            this.DeregisterRequestId(requestId);
            this.OnPacket.Unsubscribe(callback);
        }
    }
    async PingIntervalLogic() {
        if (this._connectionState !== 2) {
            this.StopPinger();
            return;
        }
        if (Date.now() - this._lastPing >= this._defaultTimeoutMs)
            this.Disconnect(Locales.VcMcApi.DisconnectReason.Timeout);
        this.SendPacket(new McApiPingRequestPacket());
    }
    async HandlePacketAsync(packetType, reader) {
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
    HandleAcceptResponsePacket(packet) {
        this.OnPacket.Invoke(packet);
    }
    HandleDenyResponsePacket(packet) {
        this.OnPacket.Invoke(packet);
    }
    HandlePingResponsePacket(packet) {
        this.OnPacket.Invoke(packet);
        this._lastPing = Date.now();
    }
}
