import { InternalPacketType } from "../../Data/Enums";
import { InternalPacket } from "./InternalPacket";
export class InternalRequestIdAllocatedPacket extends InternalPacket {
    constructor(requestId) {
        super(requestId);
    }
    get PacketType() {
        return InternalPacketType.RequestIdAllocated;
    }
}
