import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxStringLength } from "../../../Data/Constants";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
import { Version } from "../../../Data/Version";

export class McApiLoginRequestPacket implements IMcApiPacket, IMcApiRIdPacket {
  constructor(requestId: string = "", token: string = "", version?: Version) {
    this._requestId = requestId;
    this._token = token;
    this._version = version ?? new Version(0, 0, 0);
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.LoginRequest;
  }
  public get RequestId(): string {
    return this._requestId;
  }
  public get Token(): string {
    return this._token;
  }
  public get Version(): Version {
    return this._version;
  }

  private _requestId: string;
  private _token: string;
  private _version: Version;

  public Serialize(writer: NetDataWriter) {
    writer.PutString(this._requestId, MaxStringLength);
    writer.PutString(this._token, MaxStringLength);
    writer.PutInt(this._version.Major);
    writer.PutInt(this._version.Minor);
    writer.PutInt(this._version.Build);
  }

  public Deserialize(reader: NetDataReader) {
    this._requestId = reader.GetString(MaxStringLength);
    this._token = reader.GetString(MaxStringLength);
    this._version = new Version(reader.GetInt(), reader.GetInt(), reader.GetInt());
  }

  public Set(requestId: string = "", token: string = "", version?: Version): McApiLoginRequestPacket {
    this._requestId = requestId;
    this._token = token;
    this._version = version ?? new Version(0, 0, 0);
    return this;
  }
}
