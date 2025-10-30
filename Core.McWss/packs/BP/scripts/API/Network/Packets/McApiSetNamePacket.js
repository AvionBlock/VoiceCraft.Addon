import { Constants } from "../../Data/Constants";
import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
export class McApiSetNamePacket extends McApiPacket {
    constructor(id = 0, value = "") {
        super();
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetName;
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
        writer.PutString(this.Value, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetString(Constants.MaxStringLength);
    }
}
