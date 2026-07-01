import { McApiPacketType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiCreateEntityResponsePacket {
    constructor(requestId = "", responseCode = ResponseCodes.Ok, id = 0) {
        this._requestId = requestId;
        this._responseCode = responseCode;
        this._id = id;
    }
    get PacketType() {
        return McApiPacketType.CreateEntityResponse;
    }
    get RequestId() {
        return this._requestId;
    }
    get ResponseCode() {
        return this._responseCode;
    }
    get Id() {
        return this._id;
    }
    _requestId;
    _responseCode;
    _id;
    Serialize(writer) {
        writer.PutString(this._requestId, MaxStringLength);
        writer.PutSbyte(this._responseCode);
        writer.PutInt(this._id);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._responseCode = reader.GetSbyte();
        this._id = reader.GetInt();
    }
    Set(requestId = "", responseCode = ResponseCodes.Ok, id = 0) {
        this._requestId = requestId;
        this._responseCode = responseCode;
        this._id = id;
    }
}
export var ResponseCodes;
(function (ResponseCodes) {
    ResponseCodes[ResponseCodes["Ok"] = 0] = "Ok";
    ResponseCodes[ResponseCodes["Failure"] = -1] = "Failure";
})(ResponseCodes || (ResponseCodes = {}));
