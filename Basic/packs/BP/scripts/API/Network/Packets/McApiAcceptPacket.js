import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { McApiPacket } from "./McApiPacket";
export class McApiAcceptPacket extends McApiPacket {
    constructor(requestId = "", token = "") {
        super();
        this._requestId = requestId;
        this._token = token;
    }
    get PacketType() {
        return McApiPacketType.Accept;
    }
    get RequestId() {
        return this._requestId;
    }
    get Token() {
        return this._token;
    }
    _requestId;
    _token;
    Serialize(writer) {
        writer.PutString(this.RequestId, Constants.MaxStringLength);
        writer.PutString(this.Token, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        this._requestId = reader.GetString(Constants.MaxStringLength);
        this._token = reader.GetString(Constants.MaxStringLength);
    }
}
