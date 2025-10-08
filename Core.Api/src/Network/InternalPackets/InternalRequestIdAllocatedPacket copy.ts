import { InternalPacketType } from "../../Data/Enums";
import { InternalPacket } from "./InternalPacket";

export class InternalRequestIdAllocatedPacket extends InternalPacket {
  constructor(requestId?: string) {
    super(requestId);
  }

  public override get PacketType(): InternalPacketType {
    return InternalPacketType.RequestIdAllocated;
  }
}
