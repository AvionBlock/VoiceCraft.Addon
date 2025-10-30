import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { McApiPacket } from "./McApiPacket";
export class McApiDenyPacket extends McApiPacket {
    constructor(requestId = "", token = "", reasonKey = "") {
        super();
        this._requestId = requestId;
        this._token = token;
        this._reasonKey = reasonKey;
    }
    get PacketType() {
        return McApiPacketType.Deny;
    }
    get RequestId() {
        return this._requestId;
    }
    get Token() {
        return this._requestId;
    }
    get ReasonKey() {
        return this._requestId;
    }
    _requestId;
    _token;
    _reasonKey;
    Serialize(writer) {
        writer.PutString(this.RequestId, Constants.MaxStringLength);
        writer.PutString(this.Token, Constants.MaxStringLength);
        writer.PutString(this.ReasonKey, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(Constants.MaxStringLength);
        this._token = reader.GetString(Constants.MaxStringLength);
        this._reasonKey = reader.GetString(Constants.MaxStringLength);
    }
}
