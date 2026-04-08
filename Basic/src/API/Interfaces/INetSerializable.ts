import { NetDataReader } from "../Data/NetDataReader";
import { NetDataWriter } from "../Data/NetDataWriter";

export interface INetSerializable {
  Serialize(writer: NetDataWriter): void;
  Deserialize(reader: NetDataReader): void;
}
