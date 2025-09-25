import { Constants } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { Version } from "../../Data/Version";
import { McApiPacket } from "./McApiPacket";
export class McApiLoginPacket extends McApiPacket {
    constructor(loginToken = "", version) {
        super();
        this._loginToken = loginToken;
        this._version = version ?? new Version(0, 0, 0);
    }
    get PacketType() {
        return McApiPacketType.Login;
    }
    get LoginToken() {
        return this._loginToken;
    }
    get Version() {
        return this._version;
    }
    _loginToken;
    _version;
    Serialize(writer) {
        writer.PutString(this.LoginToken, Constants.MaxStringLength);
        writer.PutInt(this.Version.Major);
        writer.PutInt(this.Version.Minor);
        writer.PutInt(this.Version.Build);
    }
    Deserialize(reader) {
        this._loginToken = reader.GetString(Constants.MaxStringLength);
        this._version = new Version(reader.GetInt(), reader.GetInt(), reader.GetInt());
    }
}
