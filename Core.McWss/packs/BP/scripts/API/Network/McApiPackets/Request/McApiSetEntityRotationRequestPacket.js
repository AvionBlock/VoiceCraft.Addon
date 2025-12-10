import { MaxStringLength } from "../../../Data/Constants";
import { Vector2 } from "../../../Data/Vector2";
export class McApiSetEntityRotationRequestPacket {
    constructor(token = "", id = 0, value = new Vector2(0, 0)) {
        this._token = token;
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 11 /* McApiPacketType.SetEntityRotationRequest */;
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
        writer.PutFloat(this._value.X);
        writer.PutFloat(this._value.Y);
    }
    Deserialize(reader) {
        this._token = reader.GetString(MaxStringLength);
        this._id = reader.GetInt();
        this._value = new Vector2(reader.GetFloat(), reader.GetFloat());
    }
    Set(token = "", id = 0, value = new Vector2(0, 0)) {
        this._token = token;
        this._id = id;
        this._value = value;
        return this;
    }
}
