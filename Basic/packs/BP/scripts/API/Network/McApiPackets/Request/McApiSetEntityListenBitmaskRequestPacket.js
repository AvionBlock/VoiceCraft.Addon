import { MaxStringLength } from "../../../Data/Constants";
export class McApiSetEntityListenBitmaskRequestPacket {
    constructor(token = "", id = 0, value = 0) {
        this._token = token;
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 8 /* McApiPacketType.SetEntityListenBitmaskRequest */;
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
        writer.PutUshort(this._value);
    }
    Deserialize(reader) {
        this._token = reader.GetString(MaxStringLength);
        this._id = reader.GetInt();
        this._value = reader.GetUshort();
    }
    Set(token = "", id = 0, value = 0) {
        this._token = token;
        this._id = id;
        this._value = value;
        return this;
    }
}
