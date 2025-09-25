import { Constants } from "../../Data/Constants";
import { InternalPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { InternalPacket } from "./InternalPacket";

export class InternalConnectPacket extends InternalPacket {
  constructor(
    requestId: string,
    ip: string = "",
    port: number = 0,
    loginToken: string = ""
  ) {
    super(requestId);
    this._ip = ip;
    this._port = port;
    this._loginToken = loginToken;
  }

  public override get PacketType(): InternalPacketType {
    return InternalPacketType.Connect;
  }

  public get Ip(): string {
    return this._ip;
  }
  public get Port(): number {
    return this._port;
  }
  public get LoginToken(): string {
    return this._loginToken;
  }
  private _ip: string;
  private _port: number;
  private _loginToken: string;

  public override Serialize(writer: NetDataWriter) {
    super.Serialize(writer);
    writer.PutString(this._ip, Constants.MaxStringLength);
    writer.PutUshort(this._port);
    writer.PutString(this._loginToken, Constants.MaxStringLength);
  }

  public override Deserialize(reader: NetDataReader) {
    super.Deserialize(reader);
    this._ip = reader.GetString(Constants.MaxStringLength);
    this._port = reader.GetUshort();
    this._loginToken = reader.GetString(Constants.MaxStringLength);
  }
}
