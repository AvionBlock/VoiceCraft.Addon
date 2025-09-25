import { Constants } from "../../Data/Constants";
export class InternalPacket {
    constructor(requestId) {
        this._requestId = requestId;
    }
    get RequestId() {
        return this._requestId;
    }
    _requestId;
    Serialize(writer) {
        writer.PutString(this._requestId, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(Constants.MaxStringLength);
    }
}
