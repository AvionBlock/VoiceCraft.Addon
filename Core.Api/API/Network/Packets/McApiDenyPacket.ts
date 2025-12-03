import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiDenyPacket extends McApiPacket {
  constructor(requestId: string = "", token: string = "", reasonKey: string = "") {
    super();
    this._requestId = requestId;
    this._token = token;
    this._reasonKey = reasonKey;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.Deny;
  }

  public get RequestId(): string {
    return this._requestId;
  }
  public get Token(): string {
    return this._token;
  }
  public get ReasonKey(): string {
    return this._reasonKey;
  }
  private _requestId: string;
  private _token: string;
  private _reasonKey: string;

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this.RequestId, Constants.MaxStringLength);
    writer.PutString(this.Token, Constants.MaxStringLength);
    writer.PutString(this.ReasonKey, Constants.MaxStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    this._requestId = reader.GetString(Constants.MaxStringLength);
    this._token = reader.GetString(Constants.MaxStringLength);
    this._reasonKey = reader.GetString(Constants.MaxStringLength);
  }
}
