import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxStringLength } from "../../../Data/Constants";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";

export class McApiAcceptResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
  constructor(requestId: string = "", token: string = "") {
    this._requestId = requestId;
    this._token = token;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.AcceptResponse;
  }
  public get RequestId(): string {
    return this._requestId;
  }
  public get Token(): string {
    return this._token;
  }

  private _requestId: string;
  private _token: string;

  public Serialize(writer: NetDataWriter) {
    writer.PutString(this._requestId, MaxStringLength);
    writer.PutString(this._token, MaxStringLength);
  }

  public Deserialize(reader: NetDataReader) {
    this._requestId = reader.GetString(MaxStringLength);
    this._token = reader.GetString(MaxStringLength);
  }

  public Set(requestId: string = "", token: string = ""): McApiAcceptResponsePacket {
    this._requestId = requestId;
    this._token = token;
    return this;
  }
}
