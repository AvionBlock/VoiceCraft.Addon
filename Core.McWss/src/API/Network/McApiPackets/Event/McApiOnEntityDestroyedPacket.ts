import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";

export class McApiOnEntityDestroyedPacket implements IMcApiPacket {
  constructor(id: number = 0) {
    this._id = id;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.OnEntityDestroyed;
  }
  public get Id(): number {
    return this._id;
  }

  private _id: number;

  public Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
  }
}
