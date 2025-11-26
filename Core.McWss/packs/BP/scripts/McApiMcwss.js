import { system } from "@minecraft/server";
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
export class McApiMcwss {
    _vc = new VoiceCraft();
    _version = new Version(1, 1, 0);
    _commands = new CommandManager(this);
    _defaultTimeoutMs = 5000;
    //Connection state objects.
    _token = undefined;
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _lastPing = 0;
    _connecting = false;
    _requestIds = new Set();
    //Queue
    OutboundQueue = new Queue();
    //Events
    OnPacket = new Event();
    OnAcceptPacket = new Event();
    OnPingPacket = new Event();
    async ConnectAsync(token) {
        this._requestIds.clear();
        const packet = new McApiLoginPacket(Guid.Create().toString(), token, this._version);
        if (this.RegisterRequestId(packet.RequestId)) {
            this.SendPacket(packet);
            const response = await this.GetResponseAsync(packet.RequestId, McApiAcceptPacket);
            if (response instanceof McApiAcceptPacket) {
                this._token = response.Token;
            }
        }
    }
    SendPacket(packet) {
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        packet.Serialize(this._writer); //Serialize
        this.OutboundQueue.enqueue(this._writer.CopyData());
    }
    async ReceivePacketAsync(packet) {
        this._reader.SetBufferSource(packet);
        const packetType = this._reader.GetByte();
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
    async GetResponseAsync(requestId, type = McApiPacket, timeout = this._defaultTimeoutMs) {
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
            throw new Error("Server response timeout!");
        }
        finally {
            this.DeregisterRequestId(requestId);
            this.OnPacket.Unsubscribe(callback);
        }
    }
    async HandlePacketAsync(packetType, reader) {
        switch (packetType) {
            case McApiPacketType.Accept:
                const acceptPacket = new McApiAcceptPacket();
                acceptPacket.Deserialize(reader);
                this.HandleAcceptPacket(acceptPacket);
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
        this.OnAcceptPacket.Invoke(packet);
    }
    HandlePingPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnPingPacket.Invoke(packet);
        if (this._token === packet.Token)
            this.SendPacket(new McApiPingPacket(this._token));
    }
}
