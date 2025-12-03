import { Constants } from "../../Data/Constants";
import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";

export class McApiSetDescriptionPacket extends McApiPacket {
  constructor(value: string = "") {
    super();
    this._value = value;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.SetDescription;
  }
  
  public get Value(): string {
    return this._value;
  }
  private _value: string;

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this.Value, Constants.MaxDescriptionStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    this._value = reader.GetString(Constants.MaxDescriptionStringLength);
  }
}