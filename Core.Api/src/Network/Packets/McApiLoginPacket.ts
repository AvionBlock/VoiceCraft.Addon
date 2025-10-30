import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { Version } from "../../Data/Version";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiLoginPacket extends McApiPacket {
  constructor(requestId: string = "", token: string = "", version?: Version) {
    super();
    this._requestId = requestId;
    this._token = token;
    this._version = version ?? new Version(0, 0, 0);
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.Login;
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

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this.RequestId, Constants.MaxStringLength)
    writer.PutString(this.Token, Constants.MaxStringLength);
    writer.PutInt(this.Version.Major);
    writer.PutInt(this.Version.Minor);
    writer.PutInt(this.Version.Build);
  }

  public override Deserialize(reader: NetDataReader) {
    this._requestId = reader.GetString(Constants.MaxStringLength);
    this._token = reader.GetString(Constants.MaxStringLength);
    this._version = new Version(reader.GetInt(), reader.GetInt(), reader.GetInt());
  }
}
