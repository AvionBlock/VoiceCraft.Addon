import { Constants } from "../../Data/Constants";
import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
export class McApiSetDescriptionPacket extends McApiPacket {
    constructor(value = "") {
        super();
        this._value = value;
    }
    get PacketType() {
        return McApiPacketType.SetDescription;
    }
    get Value() {
        return this._value;
    }
    _value;
    Serialize(writer) {
        writer.PutString(this.Value, Constants.MaxDescriptionStringLength);
    }
    Deserialize(reader) {
        this._value = reader.GetString(Constants.MaxDescriptionStringLength);
    }
}
