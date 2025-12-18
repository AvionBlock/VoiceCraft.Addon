import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { Vector3 } from "../../../Data/Vector3";

export class McApiSetEntityPositionRequestPacket implements IMcApiPacket {
  constructor(id: number = 0, value: Vector3 = new Vector3(0, 0, 0)) {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.SetEntityPositionRequest;
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
    writer.PutInt(this._id);
    writer.PutFloat(this._value.X);
    writer.PutFloat(this._value.Y);
    writer.PutFloat(this._value.Z);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
  }

  public Set(id: number = 0, value: Vector3 = new Vector3(0, 0, 0)): McApiSetEntityPositionRequestPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
