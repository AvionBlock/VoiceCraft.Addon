import { McApiPacketType } from "../../../Data/Enums";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiPingResponsePacket {
    constructor(token = "") {
        this._token = token;
    }
    get PacketType() {
        return McApiPacketType.PingResponse;
    }
    get Token() {
        return this._token;
    }
    _token;
    Serialize(writer) {
        writer.PutString(this._token, MaxStringLength);
    }
    Deserialize(reader) {
        this._token = reader.GetString(MaxStringLength);
    }
    Set(token = "") {
        this._token = token;
        return this;
    }
}
