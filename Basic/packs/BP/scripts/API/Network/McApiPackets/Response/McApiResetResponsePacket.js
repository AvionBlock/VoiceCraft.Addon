import { McApiPacketType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiResetResponsePacket {
    constructor(requestId = "", responseCode = ResponseCodes.Ok) {
        this._requestId = requestId;
        this._responseCode = responseCode;
    }
    get PacketType() {
        return McApiPacketType.ResetResponse;
    }
    get RequestId() {
        return this._requestId;
    }
    get ResponseCode() {
        return this._responseCode;
    }
    _requestId;
    _responseCode;
    Serialize(writer) {
        writer.PutString(this.RequestId, MaxStringLength);
        writer.PutSbyte(this.ResponseCode);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._responseCode = reader.GetSbyte();
    }
    Set(requestId = "", responseCode = ResponseCodes.Ok) {
        this._requestId = requestId;
        this._responseCode = responseCode;
        return this;
    }
}
export var ResponseCodes;
(function (ResponseCodes) {
    ResponseCodes[ResponseCodes["Ok"] = 0] = "Ok";
    ResponseCodes[ResponseCodes["Failure"] = -1] = "Failure";
})(ResponseCodes || (ResponseCodes = {}));
