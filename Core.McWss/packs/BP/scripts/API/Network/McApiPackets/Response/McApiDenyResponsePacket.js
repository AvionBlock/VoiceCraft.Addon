import { McApiPacketType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiDenyResponsePacket {
    constructor(requestId = "", reason = "") {
        this._requestId = requestId;
        this._reason = reason;
    }
    get PacketType() {
        return McApiPacketType.DenyResponse;
    }
    get RequestId() {
        return this._requestId;
    }
    get Reason() {
        return this._reason;
    }
    _requestId;
    _reason;
    Serialize(writer) {
        writer.PutString(this._requestId, MaxStringLength);
        writer.PutString(this._reason, MaxStringLength);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._reason = reader.GetString(MaxStringLength);
    }
    Set(requestId = "", reason = "") {
        this._requestId = requestId;
        this._reason = reason;
        return this;
    }
}
