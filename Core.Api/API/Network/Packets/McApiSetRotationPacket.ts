import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { Vector2 } from "../../Data/Vector2";

export class McApiSetRotationPacket extends McApiPacket {
  constructor(id: number = 0, value: Vector2 = new Vector2()) {
    super();
    this._id = id;
    this._value = value;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.SetRotation;
  }
  
  public get Id(): number {
    return this._id;
  }
  public get Value(): Vector2 {
    return this._value;
  }
  private _id: number;
  private _value: Vector2;

  public override Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutFloat(this.Value.X);
    writer.PutFloat(this.Value.Y);
  }

  public override Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = new Vector2(reader.GetFloat(), reader.GetFloat())
  }
}