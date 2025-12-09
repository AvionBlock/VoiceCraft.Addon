import { MaxStringLength } from "../../../Data/Constants";
export class McApiDenyResponsePacket {
    constructor(requestId = "", token = "", reason = "") {
        this._requestId = requestId;
        this._token = token;
        this._reason = reason;
    }
    get PacketType() {
        return 6 /* McApiPacketType.DenyResponse */;
    }
    get RequestId() {
        return this._requestId;
    }
    get Token() {
        return this._token;
    }
    get Reason() {
        return this._reason;
    }
    _requestId;
    _token;
    _reason;
    Serialize(writer) {
        writer.PutString(this._requestId, MaxStringLength);
        writer.PutString(this._token, MaxStringLength);
        writer.PutString(this._reason, MaxStringLength);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._token = reader.GetString(MaxStringLength);
        this._reason = reader.GetString(MaxStringLength);
    }
    Set(requestId = "", token = "", reason = "") {
        this._requestId = requestId;
        this._token = token;
        this._reason = reason;
        return this;
    }
}
