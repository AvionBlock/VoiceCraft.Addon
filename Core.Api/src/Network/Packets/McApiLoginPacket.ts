import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { Version } from "../../Data/Version";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiLoginPacket extends McApiPacket {
  constructor(loginToken: string = "", version?: Version) {
    super();
    this._loginToken = loginToken;
    this._version = version ?? new Version(0, 0, 0);
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.Login;
  }
  
  public get LoginToken(): string {
    return this._loginToken;
  }
  public get Version(): Version {
    return this._version;
  }
  private _loginToken: string;
  private _version: Version;

  public override Serialize(writer: NetDataWriter) {
    writer.PutString(this.LoginToken, Constants.MaxStringLength);
    writer.PutInt(this.Version.Major);
    writer.PutInt(this.Version.Minor);
    writer.PutInt(this.Version.Build);
  }

  public override Deserialize(reader: NetDataReader) {
    this._loginToken = reader.GetString(Constants.MaxStringLength);
    this._version = new Version(
      reader.GetInt(),
      reader.GetInt(),
      reader.GetInt()
    );
  }
}
