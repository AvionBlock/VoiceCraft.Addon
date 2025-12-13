import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";

export class McApiPingRequestPacket implements IMcApiPacket {
  constructor() {
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.PingRequest;
  }

  public Serialize(writer: NetDataWriter) {
  }

  public Deserialize(reader: NetDataReader) {
  }

  public Set(): McApiPingRequestPacket {
    return this;
  }
}
