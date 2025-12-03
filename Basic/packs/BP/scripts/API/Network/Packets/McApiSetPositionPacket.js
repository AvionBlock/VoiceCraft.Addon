import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { Vector3 } from "../../Data/Vector3";
export class McApiSetPositionPacket extends McApiPacket {
    constructor(id = 0, value = new Vector3()) {
        super();
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetPosition;
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
        writer.PutFloat(this.Value.Z);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
    }
}
