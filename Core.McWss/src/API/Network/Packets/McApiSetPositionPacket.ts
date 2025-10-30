import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { Vector3 } from "../../Data/Vector3";

export class McApiSetPositionPacket extends McApiPacket {
  constructor(id: number = 0, value: Vector3 = new Vector3()) {
    super();
    this._id = id;
    this._value = value;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.SetPosition;
  }
  
  public get Id(): number {
    return this._id;
  }
  public get Value(): Vector3 {
    return this._value;
  }
  private _id: number;
  private _value: Vector3;

  public override Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutFloat(this.Value.X);
    writer.PutFloat(this.Value.Y);
    writer.PutFloat(this.Value.Z);
  }

  public override Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat())
  }
}