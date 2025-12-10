import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxStringLength } from "../../../Data/Constants";

export class McApiSetEntityEffectBitmaskRequestPacket implements IMcApiPacket {
  constructor(token: string = "", id: number = 0, value: number = 0) {
    this._token = token;
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.SetEntityEffectBitmaskRequest;
  }
  public get Token(): string {
    return this._token;
  }
  public get Id(): number {
    return this._id;
  }
  public get Value(): number {
    return this._value;
  }

  private _token: string;
  private _id: number;
  private _value: number;

  public Serialize(writer: NetDataWriter) {
    writer.PutString(this._token, MaxStringLength);
    writer.PutInt(this._id);
    writer.PutUshort(this._value);
  }

  public Deserialize(reader: NetDataReader) {
    this._token = reader.GetString(MaxStringLength);
    this._id = reader.GetInt();
    this._value = reader.GetUshort();
  }

  public Set(token: string = "", id: number = 0, value: number = 0): McApiSetEntityEffectBitmaskRequestPacket {
    this._token = token;
    this._id = id;
    this._value = value;
    return this;
  }
}
