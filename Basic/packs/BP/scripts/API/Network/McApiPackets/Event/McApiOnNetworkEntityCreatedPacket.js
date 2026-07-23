import { EventType, PositioningType } from "../../../Data/Enums";
import { Guid } from "../../../Data/Guid";
import { McApiOnEntityCreatedPacket } from "./McApiOnEntityCreatedPacket";
import { MaxStringLength } from "../../../Data/Constants";
export class McApiOnNetworkEntityCreatedPacket extends McApiOnEntityCreatedPacket {
    constructor(id = 0, loudness = 0.0, lastSpoke = 0n, userGuid = Guid.CreateEmpty(), serverUserGuid = Guid.CreateEmpty(), locale = "", positioningType = PositioningType.Server) {
        super(id, loudness, lastSpoke);
        this._userGuid = userGuid;
        this._serverUserGuid = serverUserGuid;
        this._locale = locale;
        this._positioningType = positioningType;
    }
    get EventType() {
        return EventType.OnNetworkEntityCreated;
    }
    get UserGuid() {
        return this._userGuid;
    }
    get ServerUserGuid() {
        return this._serverUserGuid;
    }
    get Locale() {
        return this._locale;
    }
    get PositioningType() {
        return this._positioningType;
    }
    _userGuid;
    _serverUserGuid;
    _locale;
    _positioningType;
    Serialize(writer) {
        super.Serialize(writer);
        writer.PutString(this._userGuid.toString(), MaxStringLength);
        writer.PutString(this._serverUserGuid.toString(), MaxStringLength);
        writer.PutString(this._locale, MaxStringLength);
        writer.PutByte(this._positioningType);
    }
    Deserialize(reader) {
        super.Deserialize(reader);
        this._userGuid = Guid.Parse(reader.GetString(MaxStringLength));
        this._serverUserGuid = Guid.Parse(reader.GetString(MaxStringLength));
        this._locale = reader.GetString(MaxStringLength);
        this._positioningType = reader.GetByte();
    }
    Set(id = 0, loudness = 0.0, lastSpoke = 0n, userGuid = Guid.CreateEmpty(), serverUserGuid = Guid.CreateEmpty(), locale = "", positioningType = PositioningType.Server) {
        super.Set(id, loudness, lastSpoke);
        this._userGuid = userGuid;
        this._serverUserGuid = serverUserGuid;
        this._locale = locale;
        this._positioningType = positioningType;
    }
}
