import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { Version } from "../../Data/Version";
import { McApiPacket } from "./McApiPacket";
export class McApiLoginPacket extends McApiPacket {
    constructor(requestId = "", token = "", version) {
        super();
        this._requestId = requestId;
        this._token = token;
        this._version = version ?? new Version(0, 0, 0);
    }
    get PacketType() {
        return McApiPacketType.Login;
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
        writer.PutString(this.RequestId, Constants.MaxStringLength);
        writer.PutString(this.Token, Constants.MaxStringLength);
        writer.PutInt(this.Version.Major);
        writer.PutInt(this.Version.Minor);
        writer.PutInt(this.Version.Build);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(Constants.MaxStringLength);
        this._token = reader.GetString(Constants.MaxStringLength);
        this._version = new Version(reader.GetInt(), reader.GetInt(), reader.GetInt());
    }
}
