import { McApiPacketType } from "../../../Data/Enums";
import { Vector2 } from "../../../Data/Vector2";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";

export class McApiOnEntityRotationUpdatedPacket implements IMcApiPacket {
  constructor(id: number = 0, value: Vector2 = new Vector2(0, 0)) {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.OnEntityRotationUpdated;
  }
  public get Id(): number {
    return this._id;
  }
  public get Value(): Vector2 {
    return this._value;
  }

  private _id: number;
  private _value: Vector2;

  public Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutFloat(this._value.X);
    writer.PutFloat(this._value.Y);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = new Vector2(reader.GetFloat(), reader.GetFloat());
  }

  public Set(id: number = 0, value: Vector2 = new Vector2(0, 0)): McApiOnEntityRotationUpdatedPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
