import { McApiPacketType } from "../../Data/Enums";
import { INetSerializable } from "../INetSerializable";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
export declare abstract class McApiPacket implements INetSerializable {
    abstract get PacketType(): McApiPacketType;
    abstract Serialize(writer: NetDataWriter): void;
    abstract Deserialize(reader: NetDataReader): void;
}
