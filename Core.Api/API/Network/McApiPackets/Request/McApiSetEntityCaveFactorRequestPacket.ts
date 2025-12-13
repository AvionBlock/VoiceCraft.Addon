import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";

export class McApiSetEntityCaveFactorRequestPacket implements IMcApiPacket {
  constructor(id: number = 0, value: number = 0) {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.SetEntityCaveFactorRequest;
  }
  public get Id(): number {
    return this._id;
  }
  public get Value(): number {
    return this._value;
  }

  private _id: number;
  private _value: number;

  public Serialize(writer: NetDataWriter) {
    writer.PutInt(this._id);
    writer.PutFloat(this._value);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = reader.GetFloat();
  }

  public Set(id: number = 0, value: number = 0): McApiSetEntityCaveFactorRequestPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
