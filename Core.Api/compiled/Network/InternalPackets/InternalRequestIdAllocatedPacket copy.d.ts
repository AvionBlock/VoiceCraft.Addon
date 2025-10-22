import { InternalPacketType } from "../../Data/Enums";
import { InternalPacket } from "./InternalPacket";
export declare class InternalRequestIdAllocatedPacket extends InternalPacket {
    constructor(requestId?: string);
    get PacketType(): InternalPacketType;
}
