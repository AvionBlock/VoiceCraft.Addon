import { MaxStringLength } from "../../../Data/Constants";
import { Version } from "../../../Data/Version";
export class McApiLoginRequestPacket {
    constructor(requestId = "", token = "", version) {
        this._requestId = requestId;
        this._token = token;
        this._version = version ?? new Version(0, 0, 0);
    }
    get PacketType() {
        return 0 /* McApiPacketType.LoginRequest */;
    }
    get RequestId() {
        return this._requestId;
    }
    get Token() {
        return this._token;
    }
    get Version() {
        return this._version;
    }
    _requestId;
    _token;
    _version;
    Serialize(writer) {
        writer.PutString(this._requestId, MaxStringLength);
        writer.PutString(this._token, MaxStringLength);
        writer.PutInt(this._version.Major);
        writer.PutInt(this._version.Minor);
        writer.PutInt(this._version.Build);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._token = reader.GetString(MaxStringLength);
        this._version = new Version(reader.GetInt(), reader.GetInt(), reader.GetInt());
    }
    Set(requestId = "", token = "", version) {
        this._requestId = requestId;
        this._token = token;
        this._version = version ?? new Version(0, 0, 0);
        return this;
    }
}
