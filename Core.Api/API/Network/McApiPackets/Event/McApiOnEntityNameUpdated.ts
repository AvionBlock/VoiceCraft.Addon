import { MaxStringLength } from "../../../Data/Constants";
import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";

export class McApiOnEntityNameUpdatedPacket implements IMcApiPacket {
  constructor(id: number = 0, value: string = "") {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.OnEntityNameUpdated;
  }
  public get Id(): number {
    return this._id;
  }
  public get Value(): string {
    return this._value;
  }

  private _id: number;
  private _value: string;

  public Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutString(this._value, MaxStringLength);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = reader.GetString(MaxStringLength);
  }

  public Set(id: number = 0, value: string = ""): McApiOnEntityNameUpdatedPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
