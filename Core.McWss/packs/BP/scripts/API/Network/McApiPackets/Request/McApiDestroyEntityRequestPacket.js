import { McApiPacketType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiDestroyEntityRequestPacket {
    constructor(requestId = "", id = 0) {
        this._requestId = requestId;
        this._id = id;
    }
    get PacketType() {
        return McApiPacketType.DestroyEntityRequest;
    }
    get RequestId() {
        return this._requestId;
    }
    get Id() {
        return this._id;
    }
    _requestId;
    _id;
    Serialize(writer) {
        writer.PutString(this.RequestId, MaxStringLength);
        writer.PutInt(this.Id);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(MaxStringLength);
        this._id = reader.GetInt();
    }
    Set(requestId = "", id = 0) {
        this._requestId = requestId;
        this._id = id;
        return this;
    }
}
