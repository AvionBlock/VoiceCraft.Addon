import { MaxStringLength } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiLogoutPacket extends McApiPacket {
  constructor(token: string = "") {
    super();
    this._token = token;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.Login;
  }

  public get Token(): string {
    return this._token;
  }
  private _token: string;

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this.Token, MaxStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    this._token = reader.GetString(MaxStringLength);
  }
}
