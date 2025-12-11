import { MaxStringLength } from "../../../Data/Constants";
import { Guid } from "../../../Data/Guid";
import { Vector2 } from "../../../Data/Vector2";
import { Vector3 } from "../../../Data/Vector3";
import { McApiOnEntityCreatedPacket } from "./McApiOnEntityCreatedPacket";
export class McApiOnNetworkEntityCreatedPacket extends McApiOnEntityCreatedPacket {
    constructor(id = 0, loudness = 0, lastSpoke = 0n, worldId = "", name = "", muted = false, deafened = false, talkBitmask = 0, listenBitmask = 0, effectBitmask = 0, position = new Vector3(), rotation = new Vector2(), caveFactor = 0, muffleFactor = 0, userGuid = Guid.CreateEmpty(), serverUserGuid = Guid.CreateEmpty(), locale = "", positioningType = 0 /* PositioningType.Server */) {
        super(id, loudness, lastSpoke, worldId, name, muted, deafened, talkBitmask, listenBitmask, effectBitmask, position, rotation, caveFactor, muffleFactor);
        this._userGuid = userGuid;
        this._serverUserGuid = serverUserGuid;
        this._locale = locale;
        this._positioningType = positioningType;
    }
    get PacketType() {
        return 21 /* McApiPacketType.OnNetworkEntityCreated */;
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
    Set(id = 0, loudness = 0, lastSpoke = 0n, worldId = "", name = "", muted = false, deafened = false, talkBitmask = 0, listenBitmask = 0, effectBitmask = 0, position = new Vector3(), rotation = new Vector2(), caveFactor = 0, muffleFactor = 0, userGuid = Guid.CreateEmpty(), serverUserGuid = Guid.CreateEmpty(), locale = "", positioningType = 0 /* PositioningType.Server */) {
        super.Set(id, loudness, lastSpoke, worldId, name, muted, deafened, talkBitmask, listenBitmask, effectBitmask, position, rotation, caveFactor, muffleFactor);
        this._userGuid = userGuid;
        this._serverUserGuid = serverUserGuid;
        this._locale = locale;
        this._positioningType = positioningType;
        return this;
    }
}
