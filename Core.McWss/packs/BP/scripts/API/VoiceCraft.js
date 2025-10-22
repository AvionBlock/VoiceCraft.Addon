import { system } from "@minecraft/server";
import { InternalPacketType } from "./Data/Enums";
import { InternalConnectPacket } from "./Network/InternalPackets/InternalConnectPacket";
import { NetDataReader } from "./Network/NetDataReader";
import { NetDataWriter } from "./Network/NetDataWriter";
import { Z85 } from "./Encoders/Z85";
import { Event } from "./Event";
import { InternalMcApiPacket } from "./Network/InternalPackets/InternalMcApiPacket";
import { InternalRequestIdAllocatedPacket } from "./Network/InternalPackets/InternalRequestIdAllocatedPacket copy";
import { InternalRequestIdUnallocatedPacket } from "./Network/InternalPackets/InternalRequestIdUnallocatedPacket";
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
    OnInternalPacketReceived = new Event();
    OnInternalRequestIdAllocatedPacket = new Event();
    OnInternalRequestIdUnallocatedPacket = new Event();
    OnInternalConnectPacket = new Event();
    //McApi
    OnMcApiPacketReceived = new Event();
    async AllocatedRequestId(requestId) {
        if (this._requests.add(requestId)) {
            await this.SendInternalPacketNoResponseAsync(new InternalRequestIdAllocatedPacket(requestId));
            return true;
        }
        return false;
    }
    async UnallocateRequestId(requestId) {
        if (this._requests.delete(requestId))
            await this.SendInternalPacketNoResponseAsync(new InternalRequestIdUnallocatedPacket(requestId));
    }
    async SendPacketAsync(requestId, packet) {
        const internalPacket = new InternalMcApiPacket(requestId, packet);
        const result = await this.SendInternalPacketAsync(internalPacket);
        return result;
    }
    async SendInternalPacketAsync(packet) {
        if (packet.RequestId !== undefined && this._requests.has(packet.RequestId))
            throw new Error(`A request with the id ${packet.RequestId} already exists!`);
        this._writer.Reset();
        this._writer.PutShort(packet.PacketType);
        packet.Serialize(this._writer);
        const data = Z85.GetStringWithPadding(this._writer.Data.slice(0, this._writer.Length));
        if (packet.RequestId !== undefined && (await this.AllocatedRequestId(packet.RequestId))) {
            system.sendScriptEvent("vc:internal_api", data);
            const result = await this.GetInternalPacketResultAsync(packet.RequestId);
            this.UnallocateRequestId(packet.RequestId);
            return result;
        }
        system.sendScriptEvent("vc:internal_api", data);
        return { Packet: undefined, Entity: undefined };
    }
    async SendInternalPacketNoResponseAsync(packet) {
        this._writer.Reset();
        this._writer.PutShort(packet.PacketType);
        packet.Serialize(this._writer);
        const data = Z85.GetStringWithPadding(this._writer.Data.slice(0, this._writer.Length));
        system.sendScriptEvent("vc:internal_api", data);
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
        return result;
    }
    HandleScriptEvent(ev) {
        if (ev.id !== "vc:internal_api")
            return;
        const data = Z85.GetBytesWithPadding(ev.message);
        this._reader.SetBufferSource(data);
        const id = this._reader.GetShort();
        switch (id) {
            case InternalPacketType.RequestIdAllocated:
                const requestIdAllocatedPacket = new InternalRequestIdAllocatedPacket();
                requestIdAllocatedPacket.Deserialize(this._reader);
                this.HandleInternalRequestIdAllocatedPacket(requestIdAllocatedPacket, ev.initiator ?? ev.sourceEntity);
                break;
            case InternalPacketType.RequestIdUnallocated:
                const requestIdUnallocatedPacket = new InternalRequestIdUnallocatedPacket();
                requestIdUnallocatedPacket.Deserialize(this._reader);
                this.HandleInternalRequestIdUnallocatedPacket(requestIdUnallocatedPacket, ev.initiator ?? ev.sourceEntity);
                break;
            case InternalPacketType.Connect:
                const connectPacket = new InternalConnectPacket();
                connectPacket.Deserialize(this._reader);
                this.HandleInternalConnectPacket(connectPacket, ev.initiator ?? ev.sourceEntity);
                break;
        }
    }
    HandleInternalRequestIdAllocatedPacket(packet, entity) {
        this.OnInternalPacketReceived.Invoke({ Packet: packet, Entity: entity });
        this.OnInternalRequestIdAllocatedPacket.Invoke({ Packet: packet, Entity: entity });
    }
    HandleInternalRequestIdUnallocatedPacket(packet, entity) {
        this.OnInternalPacketReceived.Invoke({ Packet: packet, Entity: entity });
        this.OnInternalRequestIdUnallocatedPacket.Invoke({ Packet: packet, Entity: entity });
    }
    HandleInternalConnectPacket(packet, entity) {
        this.OnInternalPacketReceived.Invoke({ Packet: packet, Entity: entity });
        this.OnInternalConnectPacket.Invoke({ Packet: packet, Entity: entity });
    }
}
