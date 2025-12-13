import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { Vector2 } from "../../../Data/Vector2";

export class McApiSetEntityRotationRequestPacket implements IMcApiPacket {
  constructor(id: number = 0, value: Vector2 = new Vector2(0, 0)) {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.SetEntityRotationRequest;
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
    writer.PutInt(this._id);
    writer.PutFloat(this._value.X);
    writer.PutFloat(this._value.Y);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = new Vector2(reader.GetFloat(), reader.GetFloat());
  }

  public Set(id: number = 0, value: Vector2 = new Vector2(0, 0)): McApiSetEntityRotationRequestPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
