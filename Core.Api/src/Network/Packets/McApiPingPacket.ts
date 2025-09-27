import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiPingPacket extends McApiPacket {
  constructor(sessionToken: string = "") {
    super();
    this._sessionToken = sessionToken;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.Ping;
  }

  public get SessionToken(): string {
    return this._sessionToken;
  }
  private _sessionToken: string;

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this._sessionToken, Constants.MaxStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    this._sessionToken = reader.GetString(Constants.MaxStringLength);
  }
}
