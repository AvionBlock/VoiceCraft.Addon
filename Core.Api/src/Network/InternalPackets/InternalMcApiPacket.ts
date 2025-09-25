import { InternalPacketType, McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "../Packets/McApiPacket";
import { InternalPacket } from "./InternalPacket";

export class InternalMcApiPacket extends InternalPacket {
  constructor(requestId: string, packet?: McApiPacket) {
    super(requestId);
    this._type = packet?.PacketType ?? 256 as McApiPacketType; //This will always be an unknown packet type.
    this._packet = packet;
  }

  public override get PacketType(): InternalPacketType {
    return InternalPacketType.Connect;
  }

  public get Type(): McApiPacketType {
    return this._type;
  }
  public get Packet(): McApiPacket | undefined {
    return this._packet;
  }
  private _type: McApiPacketType;
  private _packet?: McApiPacket;

  public override Serialize(writer: NetDataWriter) {
    super.Serialize(writer);
    writer.PutShort(this._packet?.PacketType ?? 256 as McApiPacketType); //Put short so we can handle numbers larger than 255
    this._packet?.Serialize(writer);
  }

  public override Deserialize(reader: NetDataReader) {
    super.Deserialize(reader);
    this._type = reader.GetShort() as McApiPacketType;
  }
}
