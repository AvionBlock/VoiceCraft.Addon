import { NetDataReader } from "./NetDataReader";
import { NetDataWriter } from "./NetDataWriter";
export interface INetSerializable {
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
