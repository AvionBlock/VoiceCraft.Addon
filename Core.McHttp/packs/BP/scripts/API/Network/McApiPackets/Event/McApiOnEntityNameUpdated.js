import { MaxStringLength } from "../../../Data/Constants";
import { McApiPacketType } from "../../../Data/Enums";
export class McApiOnEntityNameUpdatedPacket {
    constructor(id = 0, value = "") {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.OnEntityNameUpdated;
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
        writer.PutString(this._value, MaxStringLength);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetString(MaxStringLength);
    }
    Set(id = 0, value = "") {
        this._id = id;
        this._value = value;
        return this;
    }
}
