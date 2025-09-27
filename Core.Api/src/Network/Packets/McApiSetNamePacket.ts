import { Constants } from "../../Data/Constants";
import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";

export class McApiSetNamePacket extends McApiPacket {
  constructor(id: number = 0, value: string = "") {
    super();
    this._id = id;
    this._value = value;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.SetName;
  }
  
  public get Id(): number {
    return this._id;
  }
  public get Value(): string {
    return this._value;
  }
  private _id: number;
  private _value: string;

  public override Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutString(this.Value, Constants.MaxStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = reader.GetString(Constants.MaxStringLength);
  }
}