import { InternalPacketType } from "../../Data/Enums";
import { InternalPacket } from "./InternalPacket";
export declare class InternalRequestIdUnallocatedPacket extends InternalPacket {
    constructor(requestId?: string);
    get PacketType(): InternalPacketType;
}
