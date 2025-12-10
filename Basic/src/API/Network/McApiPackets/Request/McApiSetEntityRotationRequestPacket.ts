import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxStringLength } from "../../../Data/Constants";
import { Vector2 } from "../../../Data/Vector2";

export class McApiSetEntityRotationRequestPacket implements IMcApiPacket {
  constructor(token: string = "", id: number = 0, value: Vector2 = new Vector2(0, 0)) {
    this._token = token;
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.SetEntityRotationRequest;
  }
  public get Token(): string {
    return this._token;
  }
  public get Id(): number {
    return this._id;
  }
  public get Value(): Vector2 {
    return this._value;
  }

  private _token: string;
  private _id: number;
  private _value: Vector2;

  public Serialize(writer: NetDataWriter) {
    writer.PutString(this._token, MaxStringLength);
    writer.PutInt(this._id);
    writer.PutFloat(this._value.X);
    writer.PutFloat(this._value.Y);
  }

  public Deserialize(reader: NetDataReader) {
    this._token = reader.GetString(MaxStringLength);
    this._id = reader.GetInt();
    this._value = new Vector2(reader.GetFloat(), reader.GetFloat());
  }

  public Set(token: string = "", id: number = 0, value: Vector2 = new Vector2(0, 0)): McApiSetEntityRotationRequestPacket {
    this._token = token;
    this._id = id;
    this._value = value;
    return this;
  }
}
