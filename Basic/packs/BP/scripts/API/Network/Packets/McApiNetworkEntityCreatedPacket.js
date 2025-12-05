import { Constants } from "../../Data/Constants";
import { McApiPacketType, PositioningType } from "../../Data/Enums";
import { Guid } from "../../Data/Guid";
import { Vector2 } from "../../Data/Vector2";
import { Vector3 } from "../../Data/Vector3";
import { McApiEntityCreatedPacket } from "./McApiEntityCreatedPacket";
export class McApiNetworkEntityCreatedPacket extends McApiEntityCreatedPacket {
    constructor(id = 0, loudness = 0, lastSpoke = 0n, worldId = "", name = "", muted = false, deafened = false, talkBitmask = 0, listenBitmask = 0, effectBitmask = 0, position = new Vector3(), rotation = new Vector2(), caveFactor = 0, muffleFactor = 0, userGuid = Guid.CreateEmpty(), serverUserGuid = Guid.CreateEmpty(), locale = "", positioningType = PositioningType.Server) {
        super(id, loudness, lastSpoke, worldId, name, muted, deafened, talkBitmask, listenBitmask, effectBitmask, position, rotation, caveFactor, muffleFactor);
        this._userGuid = userGuid;
        this._serverUserGuid = serverUserGuid;
        this._locale = locale;
        this._positioningType = positioningType;
    }
    get PacketType() {
        return McApiPacketType.NetworkEntityCreated;
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
        throw new Error("Not Implemented");
    }
    Deserialize(reader) {
        super.Deserialize(reader);
        reader.SkipBytes(16); //Guid not implemented.
        reader.SkipBytes(16); //Guid not implemented.
        this._locale = reader.GetString(Constants.MaxStringLength);
        this._positioningType = reader.GetByte();
    }
}
