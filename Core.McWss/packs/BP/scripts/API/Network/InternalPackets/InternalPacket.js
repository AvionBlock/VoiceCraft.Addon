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
        if (this._requestId !== undefined)
            writer.PutString(this._requestId, Constants.MaxStringLength);
        else
            writer.PutString("", Constants.MaxStringLength);
    }
    Deserialize(reader) {
        const requestId = reader.GetString(Constants.MaxStringLength);
        if (requestId.length === 0)
            this._requestId = undefined;
        else
            this._requestId = requestId;
    }
}
