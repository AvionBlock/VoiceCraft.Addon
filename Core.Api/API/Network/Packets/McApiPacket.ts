import { McApiPacketType } from "../../Data/Enums";
import { INetSerializable } from "../INetSerializable";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";

export abstract class McApiPacket implements INetSerializable {
  public abstract get PacketType(): McApiPacketType;
  public abstract Serialize(writer: NetDataWriter): void;
  public abstract Deserialize(reader: NetDataReader): void;
}
