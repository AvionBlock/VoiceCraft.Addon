import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { McApiPacket } from "./McApiPacket";
export class McApiAcceptPacket extends McApiPacket {
    constructor(sessionToken = "") {
        super();
        this._sessionToken = sessionToken;
    }
    get PacketType() {
        return McApiPacketType.Accept;
    }
    get SessionToken() {
        return this._sessionToken;
    }
    _sessionToken;
    Serialize(writer) {
        writer.PutString(this._sessionToken, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        this._sessionToken = reader.GetString(Constants.MaxStringLength);
    }
}
