import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";

export class McApiSetMuffleFactorPacket extends McApiPacket {
  constructor(id: number = 0, value: number = 0) {
    super();
    this._id = id;
    this._value = value;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.SetMuffleFactor;
  }
  
  public get Id(): number {
    return this._id;
  }
  public get Value(): number {
    return this._value;
  }
  private _id: number;
  private _value: number;

  public override Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutFloat(this.Value);
  }

  public override Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = reader.GetFloat();
  }
}