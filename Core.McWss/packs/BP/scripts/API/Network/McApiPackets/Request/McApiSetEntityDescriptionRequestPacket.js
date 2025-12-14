import { MaxDescriptionStringLength } from "../../../Data/Constants";
export class McApiSetEntityDescriptionRequestPacket {
    constructor(id = 0, value = "") {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 6 /* McApiPacketType.SetEntityDescriptionRequest */;
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
        writer.PutString(this._value, MaxDescriptionStringLength);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetString(MaxDescriptionStringLength);
    }
    Set(id = 0, value = "") {
        this._id = id;
        this._value = value;
        return this;
    }
}
