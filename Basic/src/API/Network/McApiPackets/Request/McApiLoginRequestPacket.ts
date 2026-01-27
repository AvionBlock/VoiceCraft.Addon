import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
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
    writer.PutString(this.RequestId, MaxStringLength);
    writer.PutString(this.Token, MaxStringLength);
    writer.PutInt(this.Version.Major);
    writer.PutInt(this.Version.Minor);
    writer.PutInt(this.Version.Build);
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
