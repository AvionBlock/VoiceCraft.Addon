import { system, world } from "@minecraft/server";
import { Version } from "./API/Data/Version";
import { VoiceCraft } from "./API/VoiceCraft";
import { NetDataWriter } from "./API/Network/NetDataWriter";
import { NetDataReader } from "./API/Network/NetDataReader";
import { CommandManager } from "./Managers/CommandManager";
import { Guid } from "./API/Data/Guid";
import { McApiPacketType } from "./API/Data/Enums";
import { Event } from "./API/Event";
import { Queue } from "./API/Data/Queue";
import { McApiPacket } from "./API/Network/Packets/McApiPacket";
import { McApiPingPacket } from "./API/Network/Packets/McApiPingPacket";
import { McApiAcceptPacket } from "./API/Network/Packets/McApiAcceptPacket";
import { McApiLoginPacket } from "./API/Network/Packets/McApiLoginPacket";
import { McApiDenyPacket } from "./API/Network/Packets/McApiDenyPacket";
import { Locales } from "./API/Locales";
import { McApiLogoutPacket } from "./API/Network/Packets/McApiLogoutPacket";
import { Z85 } from "./API/Encoders/Z85";
import "./Extensions";
export class McApiMcwss {
    _version = new Version(1, 1, 0);
    _commands = new CommandManager(this);
    _defaultTimeoutMs = 10000;
    //Connection state objects.
    _token = undefined;
    _pinger = undefined;
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _lastPing = 0;
    _connectionState = 0; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
    _requestIds = new Set();
    //Queue
    OutboundQueue = new Queue();
    //Events
    OnConnected = new Event();
    OnPacket = new Event();
    async ConnectAsync(token) {
        if (this._connectionState !== 0)
            throw new Error("Already in connecting/connected state!");
        try {
            this._connectionState = 1;
            this._requestIds.clear();
            this.OutboundQueue.clear();
            const packet = new McApiLoginPacket(Guid.Create().toString(), token, this._version);
            if (this.RegisterRequestId(packet.RequestId)) {
                this.SendPacket(packet);
                const response = await this.GetResponseAsync(packet.RequestId);
                if (response instanceof McApiAcceptPacket) {
                    this._token = response.Token;
                    this._lastPing = Date.now();
                }
                else if (response instanceof McApiDenyPacket) {
                    throw new Error(response.ReasonKey);
                }
                if (this._pinger !== undefined) {
                    system.clearRun(this._pinger);
                    this._pinger = undefined;
                }
                this._pinger = system.runInterval(() => this.PingIntervalLogic(), Math.round(this._defaultTimeoutMs / 4 / 20));
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
        if (this._token === undefined)
            return;
        this._connectionState = 3;
        if (this._pinger !== undefined)
            system.clearRun(this._pinger);
        this.OutboundQueue.clear();
        this.SendPacket(new McApiLogoutPacket(this._token));
        this._connectionState = 0;
        world.translateMessage(Locales.VcMcApi.Status.Disconnected, {
            rawtext: [
                {
                    translate: reason === undefined
                        ? Locales.VcMcApi.DisconnectReason.None
                        : reason,
                },
            ],
        });
    }
    SendPacket(packet) {
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        packet.Serialize(this._writer); //Serialize
        this.OutboundQueue.enqueue(this._writer.CopyData());
    }
    async ReceivePacketAsync(packet) {
        const packetData = Z85.GetBytesWithPadding(packet);
        if (packetData.length <= 0)
            return;
        this._reader.SetBufferSource(packetData);
        const packetType = this._reader.GetByte();
        if (!(packetType in McApiPacketType))
            return; //Not a valid packet.
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onPacket`, packet);
        await this.HandlePacketAsync(packetType, this._reader);
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
            if ("RequestId" in data &&
                typeof data.RequestId === "string" &&
                data.RequestId === requestId) {
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
    async GetTypeResponseAsync(requestId, type = McApiPacket, timeout = this._defaultTimeoutMs) {
        let callbackData = undefined;
        const callback = this.OnPacket.Subscribe((data) => {
            if ("RequestId" in data &&
                typeof data.RequestId === "string" &&
                data.RequestId === requestId &&
                data instanceof type) {
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
        if (this._connectionState !== 2 || this._token === undefined)
            return; //Will have to do something here.
        if (Date.now() - this._lastPing >= this._defaultTimeoutMs)
            this.Disconnect(Locales.VcMcApi.DisconnectReason.Timeout);
        this.SendPacket(new McApiPingPacket(this._token));
    }
    async HandlePacketAsync(packetType, reader) {
        switch (packetType) {
            case McApiPacketType.Accept:
                const acceptPacket = new McApiAcceptPacket();
                acceptPacket.Deserialize(reader);
                this.HandleAcceptPacket(acceptPacket);
                break;
            case McApiPacketType.Deny:
                const denyPacket = new McApiDenyPacket();
                denyPacket.Deserialize(reader);
                this.HandleDenyPacket(denyPacket);
                break;
            case McApiPacketType.Ping:
                const pingPacket = new McApiPingPacket();
                pingPacket.Deserialize(reader);
                this.HandlePingPacket(pingPacket);
                break;
        }
    }
    HandleAcceptPacket(packet) {
        this.OnPacket.Invoke(packet);
    }
    HandleDenyPacket(packet) {
        this.OnPacket.Invoke(packet);
    }
    HandlePingPacket(packet) {
        this.OnPacket.Invoke(packet);
        this._lastPing = Date.now();
    }
}
