import { InternalPacketType, McApiPacketType } from "../../Data/Enums";
import { InternalPacket } from "./InternalPacket";
export class InternalMcApiPacket extends InternalPacket {
    constructor(requestId, packet) {
        super(requestId);
        this._type = packet?.PacketType ?? McApiPacketType.Unknown;
        this._packet = packet;
    }
    get PacketType() {
        return InternalPacketType.Connect;
    }
    get Type() {
        return this._type;
    }
    get Packet() {
        return this._packet;
    }
    _type;
    _packet;
    Serialize(writer) {
        super.Serialize(writer);
        writer.PutShort(this._packet?.PacketType ?? McApiPacketType.Unknown); //Put short so we can handle numbers larger than 255
        this._packet?.Serialize(writer);
    }
    Deserialize(reader) {
        super.Deserialize(reader);
        this._type = reader.GetShort();
    }
}
