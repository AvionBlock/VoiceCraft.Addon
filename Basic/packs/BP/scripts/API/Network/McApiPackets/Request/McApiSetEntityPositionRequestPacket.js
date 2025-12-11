import { MaxStringLength } from "../../../Data/Constants";
import { Vector3 } from "../../../Data/Vector3";
export class McApiSetEntityPositionRequestPacket {
    constructor(token = "", id = 0, value = new Vector3(0, 0, 0)) {
        this._token = token;
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 12 /* McApiPacketType.SetEntityPositionRequest */;
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
        writer.PutFloat(this._value.Z);
    }
    Deserialize(reader) {
        this._token = reader.GetString(MaxStringLength);
        this._id = reader.GetInt();
        this._value = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
    }
    Set(token = "", id = 0, value = new Vector3(0, 0, 0)) {
        this._token = token;
        this._id = id;
        this._value = value;
        return this;
    }
}
