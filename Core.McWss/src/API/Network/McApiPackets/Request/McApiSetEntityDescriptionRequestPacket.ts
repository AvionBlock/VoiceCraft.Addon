import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxDescriptionStringLength, MaxStringLength } from "../../../Data/Constants";

export class McApiSetEntityDescriptionRequestPacket implements IMcApiPacket {
  constructor(token: string = "", id: number = 0, value: string = "") {
    this._token = token;
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.SetEntityDescriptionRequest;
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
    writer.PutString(this._value, MaxDescriptionStringLength);
  }

  public Deserialize(reader: NetDataReader) {
    this._token = reader.GetString(MaxStringLength);
    this._id = reader.GetInt();
    this._value = reader.GetString(MaxDescriptionStringLength);
  }

  public Set(token: string = "", id: number = 0, value: string = ""): McApiSetEntityDescriptionRequestPacket {
    this._token = token;
    this._id = id;
    this._value = value;
    return this;
  }
}
