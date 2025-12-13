import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxStringLength } from "../../../Data/Constants";

export class McApiSetEntityNameRequestPacket implements IMcApiPacket {
  constructor(token: string = "", id: number = 0, value: string = "") {
    this._token = token;
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.SetEntityNameRequest;
  }
  public get Token(): string {
    return this._token;
  }
  public get Id(): number {
    return this._id;
  }
  public get Value(): string {
    return this._value;
  }

  private _token: string;
  private _id: number;
  private _value: string;

  public Serialize(writer: NetDataWriter) {
    writer.PutString(this._token, MaxStringLength);
    writer.PutInt(this._id);
    writer.PutString(this._value, MaxStringLength);
  }

  public Deserialize(reader: NetDataReader) {
    this._token = reader.GetString(MaxStringLength);
    this._id = reader.GetInt();
    this._value = reader.GetString(MaxStringLength);
  }

  public Set(token: string = "", id: number = 0, value: string = ""): McApiSetEntityNameRequestPacket {
    this._token = token;
    this._id = id;
    this._value = value;
    return this;
  }
}
