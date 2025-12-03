import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
export class McApiSetMuffleFactorPacket extends McApiPacket {
    constructor(id = 0, value = 0) {
        super();
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetMuffleFactor;
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
        writer.PutFloat(this.Value);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetFloat();
    }
}
