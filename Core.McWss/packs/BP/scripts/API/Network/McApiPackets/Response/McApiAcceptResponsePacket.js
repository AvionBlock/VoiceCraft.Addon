import { MaxStringLength } from "../../../Data/Constants";
export class McApiAcceptResponsePacket {
    constructor(requestId = "", token = "") {
        this._requestId = requestId;
        this._token = token;
    }
    get PacketType() {
        return 16 /* McApiPacketType.AcceptResponse */;
    }
    get RequestId() {
        return this._requestId;
    }
    get Token() {
        return this._token;
    }
    _requestId;
    _token;
    Serialize(writer) {
        writer.PutString(this._requestId, MaxStringLength);
        writer.PutString(this._token, MaxStringLength);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._token = reader.GetString(MaxStringLength);
    }
    Set(requestId = "", token = "") {
        this._requestId = requestId;
        this._token = token;
        return this;
    }
}
