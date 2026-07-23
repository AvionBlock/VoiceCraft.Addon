import { MaxStringLength } from "../../../Data/Constants";
import { McApiPacketType } from "../../../Data/Enums";
export class McApiCreateEntityRequestPacket {
    constructor(requestId = "") {
        this._requestId = requestId;
    }
    get PacketType() {
        return McApiPacketType.CreateEntityRequest;
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
    }
}
