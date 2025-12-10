import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";

export class McApiOnEntityDeafenUpdatedPacket implements IMcApiPacket {
  constructor(id: number = 0, value: boolean = false) {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.OnEntityDeafenUpdated;
  }
  public get Id(): number {
    return this._id;
  }
  public get Value(): boolean {
    return this._value;
  }

  private _id: number;
  private _value: boolean;

  public Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutBool(this._value);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = reader.GetBool();
  }

  public Set(id: number = 0, value: boolean = false): McApiOnEntityDeafenUpdatedPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
