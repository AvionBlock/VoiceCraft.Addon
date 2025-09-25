import { Constants } from "../../Data/Constants";
import { InternalPacketType } from "../../Data/Enums";
import { InternalPacket } from "./InternalPacket";
export class InternalConnectPacket extends InternalPacket {
    constructor(requestId, ip = "", port = 0, loginToken = "") {
        super(requestId);
        this._ip = ip;
        this._port = port;
        this._loginToken = loginToken;
    }
    get PacketType() {
        return InternalPacketType.Connect;
    }
    get Ip() {
        return this._ip;
    }
    get Port() {
        return this._port;
    }
    get LoginToken() {
        return this._loginToken;
    }
    _ip;
    _port;
    _loginToken;
    Serialize(writer) {
        super.Serialize(writer);
        writer.PutString(this._ip, Constants.MaxStringLength);
        writer.PutUshort(this._port);
        writer.PutString(this._loginToken, Constants.MaxStringLength);
    }
    Deserialize(reader) {
        super.Deserialize(reader);
        this._ip = reader.GetString(Constants.MaxStringLength);
        this._port = reader.GetUshort();
        this._loginToken = reader.GetString(Constants.MaxStringLength);
    }
}
