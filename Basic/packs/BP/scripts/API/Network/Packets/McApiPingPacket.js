import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { McApiPacket } from "./McApiPacket";
export class McApiPingPacket extends McApiPacket {
    constructor(token = "") {
        super();
        this._token = token;
    }
    get PacketType() {
        return McApiPacketType.Ping;
    }
    get Token() {
        return this._token;
    }
    _token;
    Serialize(writer) {
        writer.PutString(this.Token, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        this._token = reader.GetString(Constants.MaxStringLength);
    }
}
