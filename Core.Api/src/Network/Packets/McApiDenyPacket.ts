import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiDenyPacket extends McApiPacket {
  constructor(reasonKey: string = "") {
    super();
    this._reasonKey = reasonKey;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.Deny;
  }

  public get ReasonKey(): string {
    return this._reasonKey;
  }
  private _reasonKey: string;

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this._reasonKey, Constants.MaxStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    this._reasonKey = reader.GetString(Constants.MaxStringLength);
  }
}
