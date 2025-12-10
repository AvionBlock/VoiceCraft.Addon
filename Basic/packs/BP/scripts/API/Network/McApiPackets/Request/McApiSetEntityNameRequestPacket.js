import { MaxStringLength } from "../../../Data/Constants";
export class McApiSetEntityNameRequestPacket {
    constructor(token = "", id = 0, value = "") {
        this._token = token;
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 6 /* McApiPacketType.SetEntityNameRequest */;
    }
    get Token() {
        return this._token;
    }
    get Id() {
        return this._id;
    }
    get Value() {
        return this._value;
    }
    _token;
    _id;
    _value;
    Serialize(writer) {
        writer.PutString(this._token, MaxStringLength);
        writer.PutInt(this._id);
        writer.PutString(this._value, MaxStringLength);
    }
    Deserialize(reader) {
        this._token = reader.GetString(MaxStringLength);
        this._id = reader.GetInt();
        this._value = reader.GetString(MaxStringLength);
    }
    Set(token = "", id = 0, value = "") {
        this._token = token;
        this._id = id;
        this._value = value;
        return this;
    }
}
