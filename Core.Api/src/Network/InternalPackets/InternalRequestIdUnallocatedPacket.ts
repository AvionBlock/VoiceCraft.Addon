import { InternalPacketType } from "../../Data/Enums";
import { InternalPacket } from "./InternalPacket";

export class InternalRequestIdUnallocatedPacket extends InternalPacket {
  constructor(requestId?: string) {
    super(requestId);
  }

  public override get PacketType(): InternalPacketType {
    return InternalPacketType.RequestIdUnallocated;
  }
}
