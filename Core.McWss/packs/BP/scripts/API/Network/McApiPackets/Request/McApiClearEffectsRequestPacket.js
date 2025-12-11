import { MaxStringLength } from "../../../Data/Constants";
export class McApiClearEffectsRequestPacket {
    constructor(token = "") {
        this._token = token;
    }
    get PacketType() {
        return 4 /* McApiPacketType.ClearEffectsRequest */;
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
