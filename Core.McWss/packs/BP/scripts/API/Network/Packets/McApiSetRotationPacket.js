import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { Vector2 } from "../../Data/Vector2";
export class McApiSetRotationPacket extends McApiPacket {
    constructor(id = 0, value = new Vector2()) {
        super();
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetRotation;
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
        writer.PutFloat(this.Value.X);
        writer.PutFloat(this.Value.Y);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = new Vector2(reader.GetFloat(), reader.GetFloat());
    }
}
