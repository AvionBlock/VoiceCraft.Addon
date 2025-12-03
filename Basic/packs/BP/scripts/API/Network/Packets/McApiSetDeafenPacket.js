import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
export class McApiSetDeafenPacket extends McApiPacket {
    constructor(id = 0, value = true) {
        super();
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetDeafen;
    }
    get Id() {
        return this._id;
    }
    get Value() {
        return this._value;
    }
    _id;
    _value;
    Serialize(writer) {
        writer.PutInt(this.Id);
        writer.PutBool(this.Value);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetBool();
    }
}
