import NetDataReader from "./NetDataReader";
import NetDataWriter from "./NetDataWriter";

export default class NetSerializable {
  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {}

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {}
}
