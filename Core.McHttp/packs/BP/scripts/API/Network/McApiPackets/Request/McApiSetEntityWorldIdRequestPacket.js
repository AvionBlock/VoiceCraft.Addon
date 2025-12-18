import { McApiPacketType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiSetEntityWorldIdRequestPacket {
    constructor(id = 0, value = "") {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetEntityWorldIdRequest;
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
        writer.PutInt(this._id);
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
