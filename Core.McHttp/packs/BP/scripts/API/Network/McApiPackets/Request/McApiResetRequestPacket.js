import { McApiPacketType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiResetRequestPacket {
    constructor(requestId = "") {
        this._requestId = requestId;
    }
    get PacketType() {
        return McApiPacketType.ResetRequest;
    }
    get RequestId() {
        return this._requestId;
    }
    _requestId;
    Serialize(writer) {
        writer.PutString(this._requestId, MaxStringLength);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(MaxStringLength);
    }
    Set(requestId = "") {
        this._requestId = requestId;
        return this;
    }
}
