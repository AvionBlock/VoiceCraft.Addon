import { system } from "@minecraft/server";
import { Version } from "./API/Data/Version";
import { VoiceCraft } from "./API/VoiceCraft";
import { NetDataWriter } from "./API/Network/NetDataWriter";
import { NetDataReader } from "./API/Network/NetDataReader";
import { McApiPacket } from "./API/Network/Packets/McApiPacket";
import { Z85 } from "./API/Encoders/Z85";
import { CommandManager } from "./Managers/CommandManager";
import { McApiLoginPacket } from "./API/Network/Packets/McApiLoginPacket";
import { Guid } from "./API/Data/Guid";
import { McApiPacketType } from "./API/Data/Enums";
import { McApiAcceptPacket } from "./API/Network/Packets/McApiAcceptPacket";
import { Event } from "./API/Event";
export class McApiMcwss {
    _vc = new VoiceCraft();
    _tunnelId = "vc:mcwss_api";
    _version = new Version(1, 1, 0);
    _commands = new CommandManager(this);
    _defaultTimeoutMs = 5000;
    //Connection state objects.
    _source = undefined;
    _token = undefined;
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _lastPing = 0;
    _connecting = false;
    _requestIds = new Set();
    OnPacket = new Event();
    OnAcceptPacket = new Event();
    constructor() {
        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            this.HandleScriptEvent(ev);
        });
    }
    async ConnectAsync(source, token) {
        this._requestIds.clear();
        this._source = source;
        const packet = new McApiLoginPacket(Guid.Create().toString(), token, this._version);
        if (this.RegisterRequestId(packet.RequestId)) {
            this.SendPacket(packet);
            const response = await this.GetResponseAsync(packet.RequestId, McApiAcceptPacket);
            console.log(JSON.stringify(response));
        }
    }
    SendPacket(packet) {
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        packet.Serialize(this._writer); //Serialize
        const packetData = Z85.GetStringWithPadding(this._writer.Data.slice(0, this._writer.Length));
        if (packetData.length === 0)
            return;
        //this.#_source?.sendMessage({ rawtext: [{ text: `${VoiceCraft.#_rawtextPacketId}${packetData}`}] });
        this._source?.runCommand(`tellraw @s {"rawtext":[{"text":"${this._tunnelId}${packetData}"}]}`); //We have to do it this way because of how the mc client handles chats from different sources.
        console.log(`Packet Sent: ${this._tunnelId}${packetData}`);
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
            if ("RequestId" in data && typeof data.RequestId === "string" && data.RequestId === requestId && data instanceof type) {
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
    async HandleScriptEvent(ev) {
        const data = Z85.GetBytesWithPadding(ev.message);
        this._reader.SetBufferSource(data);
        const packetType = this._reader.GetByte();
        await this.HandlePacketAsync(packetType, this._reader);
    }
    async HandlePacketAsync(packetType, reader) {
        switch (packetType) {
            case McApiPacketType.Accept:
                const acceptPacket = new McApiAcceptPacket();
                acceptPacket.Deserialize(reader);
                this.HandleAcceptPacket(acceptPacket);
                break;
        }
    }
    HandleAcceptPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnAcceptPacket.Invoke(packet);
    }
}
