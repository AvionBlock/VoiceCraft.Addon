import { Constants } from "../../Data/Constants";
import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
export class McApiSetTitlePacket extends McApiPacket {
    constructor(value = "") {
        super();
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetTitle;
    }
    get Value() {
        return this._value;
    }
    _value;
    Serialize(writer) {
        writer.PutString(this.Value, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        this._value = reader.GetString(Constants.MaxStringLength);
    }
}
