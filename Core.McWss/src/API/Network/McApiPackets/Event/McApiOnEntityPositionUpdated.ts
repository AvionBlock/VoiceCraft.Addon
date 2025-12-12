import { McApiPacketType } from "../../../Data/Enums";
import { Vector3 } from "../../../Data/Vector3";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";

export class McApiOnEntityPositionUpdatedPacket implements IMcApiPacket {
  constructor(id: number = 0, value: Vector3 = new Vector3(0, 0, 0)) {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.OnEntityPositionUpdated;
  }
  public get Id(): number {
    return this._id;
  }
  public get Value(): Vector3 {
    return this._value;
  }

  private _id: number;
  private _value: Vector3;

  public Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutFloat(this._value.X);
    writer.PutFloat(this._value.Y);
    writer.PutFloat(this._value.Z);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
  }

  public Set(id: number = 0, value: Vector3 = new Vector3(0, 0, 0)): McApiOnEntityPositionUpdatedPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
