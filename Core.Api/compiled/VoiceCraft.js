import { system, } from "@minecraft/server";
import { InternalPacketType } from "./Data/Enums";
import { InternalConnectPacket } from "./Network/InternalPackets/InternalConnectPacket";
import { NetDataReader } from "./Network/NetDataReader";
import { NetDataWriter } from "./Network/NetDataWriter";
import { Z85 } from "./Encoders/Z85";
import { InternalMcApiPacket } from "./Network/InternalPackets/InternalMcApiPacket";
export class VoiceCraft {
    constructor() {
        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            this.HandleScriptEvent(ev);
        });
    }
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _requests = new Set();
    //Events
    //Internal
    OnInternalPacketReceived;
    OnInternalConnectPacket;
    //McApi
    OnMcApiPacketReceived;
    async SendPacketAsync(requestId, packet) {
        const internalPacket = new InternalMcApiPacket(requestId, packet);
        const result = await this.SendInternalPacketAsync(internalPacket);
        return result;
    }
    async SendInternalPacketAsync(packet) {
        if (this._requests.has(packet.RequestId))
            throw new Error(`A request with the id ${packet.RequestId} already exists!`);
        this._requests.add(packet.RequestId);
        this._writer.Reset();
        packet.Serialize(this._writer);
        const data = Z85.GetStringWithPadding(this._writer.Data.slice(0, this._writer.Length));
        system.sendScriptEvent(`vc:${packet.PacketType}`, data);
        return this.GetInternalPacketResultAsync(packet.RequestId);
    }
    async GetInternalPacketResultAsync(requestId) {
        let result = undefined;
        const callback = (ev) => {
            if (ev.Packet.RequestId === requestId)
                result = ev;
        };
        this.OnInternalPacketReceived?.Subscribe(callback);
        while (result === undefined) {
            await system.waitTicks(1);
        }
        this.OnInternalPacketReceived?.Unsubscribe(callback);
        this._requests.delete(requestId);
        return result;
    }
    HandleScriptEvent(ev) {
        if (!ev.id.startsWith("vc:"))
            return;
        const data = Z85.GetBytesWithPadding(ev.message);
        this._reader.SetBufferSource(data);
        switch (ev.id) {
            case `vc:${InternalPacketType.Connect}`:
                const connectPacket = new InternalConnectPacket("");
                connectPacket.Deserialize(this._reader);
                this.HandleInternalConnectPacket(connectPacket, ev.initiator ?? ev.sourceEntity);
                break;
        }
    }
    HandleInternalConnectPacket(packet, entity) {
        this.OnInternalConnectPacket?.Invoke({ Packet: packet, Entity: entity });
    }
}
