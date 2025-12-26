import { system, world, } from "@minecraft/server";
import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";
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
import { McApiPingRequestPacket } from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
import { McApiPingResponsePacket } from "./API/Network/McApiPackets/Response/McApiPingResponsePacket";
import { McHttpUpdatePacket } from "./Packets/McHttpUpdatePacket";
export class McApiMcHttp {
    _version = new Version(VoiceCraft.MajorVersion, VoiceCraft.MinorVersion, 0);
    _cm = new CommandManager(this);
    _defaultTimeoutMs = 10000;
    //Connection state objects.
    _awaitingRequest = false;
    _hostname = undefined;
    _token = undefined;
    _pinger = undefined;
    _updater = undefined;
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _lastPing = 0;
    _connectionState = 0; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
    _disconnectReason = undefined;
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
    async ConnectAsync(hostname, token) {
        if (this._connectionState !== 0)
            throw new Error("Already in connecting/connected state!");
        this._hostname = hostname;
        this._connectionState = 1;
        this.OutboundQueue.clear();
        this.StartHttpUpdater();
        const packet = new McApiLoginRequestPacket(Guid.Create().toString(), token, this._version);
        this.SendPacket(packet);
        const expiryTime = Date.now() + this._defaultTimeoutMs;
        while (this._connectionState === 1) {
            if (Date.now() > expiryTime) {
                this._connectionState = 0;
                this._hostname = undefined;
                this.OutboundQueue.clear();
                throw new Error(Locales.VcMcApi.DisconnectReason.Timeout);
            }
            await system.waitTicks(1);
        }
        if (this._connectionState !== 2) {
            this._connectionState = 0;
            this._hostname = undefined;
            this.OutboundQueue.clear();
            throw new Error(this._disconnectReason ?? Locales.VcMcApi.DisconnectReason.Manual);
        }
        this.StartPinger();
        this._connectionState = 2;
    }
    async Disconnect(reason) {
        if (this._connectionState !== 2)
            return;
        this._connectionState = 3;
        this.StopPinger();
        this.OutboundQueue.clear();
        if (this._token !== undefined)
            this.SendPacket(new McApiLogoutRequestPacket(this._token));
        while (this.OutboundQueue.size > 0) {
            await system.waitTicks(1);
            //Send any last outgoing packets.
        }
        this._connectionState = 0;
        this._hostname = undefined;
        this._token = undefined;
        world.translateMessage(Locales.VcMcApi.Status.Disconnected, {
            rawtext: [
                {
                    translate: reason ?? Locales.VcMcApi.DisconnectReason.Manual,
                },
            ],
        });
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onDisconnected`, reason ?? Locales.VcMcApi.DisconnectReason.Manual);
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
    StartHttpUpdater() {
        this.StopHttpUpdater();
        this._updater = system.runInterval(async () => this.HttpUpdaterLogic());
    }
    StartPinger() {
        this.StopPinger();
        this._pinger = system.runInterval(() => this.PingIntervalLogic(), Math.round(this._defaultTimeoutMs / 4 / 20));
    }
    StopHttpUpdater() {
        if (this._updater !== undefined) {
            system.clearRun(this._updater);
            this._updater = undefined;
            http.cancelAll("Stop Requested");
        }
    }
    StopPinger() {
        if (this._pinger !== undefined) {
            system.clearRun(this._pinger);
            this._pinger = undefined;
        }
    }
    async PingIntervalLogic() {
        if (this._connectionState !== 2) {
            this.StopPinger();
            return;
        }
        if (Date.now() - this._lastPing >= this._defaultTimeoutMs)
            await this.Disconnect(Locales.VcMcApi.DisconnectReason.Timeout);
        this.SendPacket(new McApiPingRequestPacket());
    }
    async HttpUpdaterLogic() {
        if (this._hostname === undefined || this._connectionState === 0) {
            this.StopHttpUpdater();
            return;
        }
        try {
            if (this._awaitingRequest)
                return;
            this._awaitingRequest = true;
            const requestPacket = new McHttpUpdatePacket();
            let packet = this.OutboundQueue.dequeue();
            while (packet !== undefined) {
                requestPacket.Packets.push(Z85.GetStringWithPadding(packet));
                packet = this.OutboundQueue.dequeue();
            }
            const request = new HttpRequest(this._hostname);
            request.setBody(JSON.stringify(requestPacket));
            //@ts-ignore
            request.setMethod(HttpRequestMethod.Post);
            request.setHeaders([
                new HttpHeader('Content-Type', 'application/json'),
                new HttpHeader('Authorization', `Bearer ${this._token}`)
            ]);
            request.setTimeout(8000); //8 Second timeout. Less than the normal HTTP timeout.
            const response = await http.request(request);
            this._awaitingRequest = false;
            if (response.status !== 200)
                return;
            const responsePacket = Object.assign(new McHttpUpdatePacket(), JSON.parse(response.body));
            for (const packet of responsePacket.Packets) {
                await this.ReceivePacketAsync(packet);
            }
        }
        catch {
            //Do Nothing.
        }
        finally {
            this._awaitingRequest = false;
        }
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
        if (this._connectionState === 1) {
            this._connectionState = 2;
            this._token = packet.Token;
            this._lastPing = Date.now();
            try {
                system.sendScriptEvent(`${VoiceCraft.Namespace}:onConnected`, packet.Token);
            }
            catch {
                //Do Nothing
            }
        }
    }
    HandleDenyResponsePacket(packet) {
        this.OnPacket.Invoke(packet);
        if (this._connectionState === 1) {
            this._disconnectReason = packet.Reason;
            this._connectionState = 0;
            this._token = undefined;
            this._hostname = undefined;
            this.OutboundQueue.clear();
        }
    }
    HandlePingResponsePacket(packet) {
        this.OnPacket.Invoke(packet);
        this._lastPing = Date.now();
    }
}
