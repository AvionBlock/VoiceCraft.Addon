import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiPingPacket extends McApiPacket {
  constructor(token: string = "") {
    super();
    this._token = token;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.Ping;
  }

  public get Token(): string {
    return this._token;
  }
  private _token: string;

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this.Token, Constants.MaxStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    this._token = reader.GetString(Constants.MaxStringLength);
  }
}
