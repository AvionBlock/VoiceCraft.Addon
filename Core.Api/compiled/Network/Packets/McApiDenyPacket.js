import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { McApiPacket } from "./McApiPacket";
export class McApiDenyPacket extends McApiPacket {
    constructor(reasonKey = "") {
        super();
        this._reasonKey = reasonKey;
    }
    get PacketType() {
        return McApiPacketType.Deny;
    }
    get ReasonKey() {
        return this._reasonKey;
    }
    _reasonKey;
    Serialize(writer) {
        writer.PutString(this._reasonKey, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        this._reasonKey = reader.GetString(Constants.MaxStringLength);
    }
}
