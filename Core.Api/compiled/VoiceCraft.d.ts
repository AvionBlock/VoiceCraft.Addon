import { Entity } from "@minecraft/server";
import { InternalConnectPacket } from "./Network/InternalPackets/InternalConnectPacket";
import { Event } from "./Event";
import { InternalPacket } from "./Network/InternalPackets/InternalPacket";
import { McApiPacket } from "./Network/Packets/McApiPacket";
import { InternalRequestIdAllocatedPacket } from "./Network/InternalPackets/InternalRequestIdAllocatedPacket copy";
export declare class VoiceCraft {
    constructor();
    private _writer;
    private _reader;
    private _requests;
    OnInternalPacketReceived: Event<{
        Packet: InternalPacket;
        Entity?: Entity;
    }>;
    OnInternalRequestIdAllocatedPacket: Event<{
        Packet: InternalRequestIdAllocatedPacket;
        Entity?: Entity;
    }>;
    OnInternalRequestIdUnallocatedPacket: Event<{
        Packet: InternalRequestIdAllocatedPacket;
        Entity?: Entity;
    }>;
    OnInternalConnectPacket: Event<{
        Packet: InternalConnectPacket;
        Entity?: Entity;
    }>;
    OnMcApiPacketReceived?: Event<McApiPacket>;
    private AllocatedRequestId;
    private UnallocateRequestId;
    SendPacketAsync(requestId: string, packet: McApiPacket): Promise<{
        Packet?: InternalPacket;
        Entity?: Entity;
    }>;
    protected SendInternalPacketAsync(packet: InternalPacket): Promise<{
        Packet?: InternalPacket;
        Entity?: Entity;
    }>;
    protected SendInternalPacketNoResponseAsync(packet: InternalPacket): Promise<void>;
    private GetInternalPacketResultAsync;
    private HandleScriptEvent;
    private HandleInternalRequestIdAllocatedPacket;
    private HandleInternalRequestIdUnallocatedPacket;
    private HandleInternalConnectPacket;
}
