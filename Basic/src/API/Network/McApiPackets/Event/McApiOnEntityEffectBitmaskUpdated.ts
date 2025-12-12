import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";

export class McApiOnEntityEffectBitmaskUpdatedPacket implements IMcApiPacket {
  constructor(id: number = 0, value: number = 0) {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.OnEntityEffectBitmaskUpdated;
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
    writer.PutInt(this.Id);
    writer.PutUshort(this._value);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = reader.GetUshort();
  }

  public Set(id: number = 0, value: number = 0): McApiOnEntityEffectBitmaskUpdatedPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
