import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";

export class McApiOnEntityVisibilityUpdatedPacket implements IMcApiPacket {
  constructor(id: number = 0, id2: number = 0, value: boolean = false) {
    this._id = id;
    this._id2 = id2;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.OnEntityVisibilityUpdated;
  }
  public get Id(): number {
    return this._id;
  }
  public get Id2(): number {
    return this._id2;
  }
  public get Value(): boolean {
    return this._value;
  }

  private _id: number;
  private _id2: number;
  private _value: boolean;

  public Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutInt(this._id2);
    writer.PutBool(this._value);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._id2 = reader.GetInt();
    this._value = reader.GetBool();
  }

  public Set(id: number = 0, id2: number = 0, value: boolean = false): McApiOnEntityVisibilityUpdatedPacket {
    this._id = id;
    this._id2 = id2;
    this._value = value;
    return this;
  }
}
