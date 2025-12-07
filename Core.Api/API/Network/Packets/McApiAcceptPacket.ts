import { MaxStringLength } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiAcceptPacket extends McApiPacket {
  constructor(requestId: string = "", token: string = "") {
    super();
    this._requestId = requestId;
    this._token = token;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.Accept;
  }

  public get RequestId(): string {
    return this._requestId;
  }
  public get Token(): string {
    return this._token;
  }
  private _requestId: string;
  private _token: string;

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this.RequestId, MaxStringLength);
    writer.PutString(this.Token, MaxStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    this._requestId = reader.GetString(MaxStringLength);
    this._token = reader.GetString(MaxStringLength);
  }
}
