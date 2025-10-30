import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";

export class McApiSetMutePacket extends McApiPacket {
  constructor(id: number = 0, value: boolean = false) {
    super();
    this._id = id;
    this._value = value;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.SetMute;
  }
  
  public get Id(): number {
    return this._id;
  }
  public get Value(): boolean {
    return this._value;
  }
  private _id: number;
  private _value: boolean;

  public override Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutBool(this.Value);
  }

  public override Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = reader.GetBool();
  }
}