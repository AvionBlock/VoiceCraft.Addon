import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxStringLength } from "../../../Data/Constants";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";

export class McApiDenyResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
  constructor(requestId: string = "", reason: string = "") {
    this._requestId = requestId;
    this._reason = reason;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.DenyResponse;
  }
  public get RequestId(): string {
    return this._requestId;
  }
  public get Reason(): string {
    return this._reason;
  }

  private _requestId: string;
  private _reason: string;

  public Serialize(writer: NetDataWriter) {
    writer.PutString(this._requestId, MaxStringLength);
    writer.PutString(this._reason, MaxStringLength);
  }

  public Deserialize(reader: NetDataReader) {
    this._requestId = reader.GetString(MaxStringLength);
    this._reason = reader.GetString(MaxStringLength);
  }

  public Set(requestId: string = "", reason: string = ""): McApiDenyResponsePacket {
    this._requestId = requestId;
    this._reason = reason;
    return this;
  }
}
