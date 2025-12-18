import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { MaxDescriptionStringLength } from "../../../Data/Constants";

export class McApiSetEntityDescriptionRequestPacket implements IMcApiPacket {
  constructor(id: number = 0, value: string = "") {
    this._id = id;
    this._value = value;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.SetEntityDescriptionRequest;
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
    writer.PutInt(this._id);
    writer.PutString(this._value, MaxDescriptionStringLength);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._value = reader.GetString(MaxDescriptionStringLength);
  }

  public Set(id: number = 0, value: string = ""): McApiSetEntityDescriptionRequestPacket {
    this._id = id;
    this._value = value;
    return this;
  }
}
