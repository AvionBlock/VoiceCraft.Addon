import { MaxStringLength } from "../../../Data/Constants";
import { Vector2 } from "../../../Data/Vector2";
import { Vector3 } from "../../../Data/Vector3";
export class McApiOnEntityCreatedPacket {
    constructor(id = 0, loudness = 0, lastSpoke = 0n, worldId = "", name = "", muted = false, deafened = false, talkBitmask = 0, listenBitmask = 0, effectBitmask = 0, position = new Vector3(), rotation = new Vector2(), caveFactor = 0, muffleFactor = 0) {
        this._id = id;
        this._loudness = loudness;
        this._lastSpoke = lastSpoke;
        this._worldId = worldId;
        this._name = name;
        this._muted = muted;
        this._deafened = deafened;
        this._talkBitmask = talkBitmask;
        this._listenBitmask = listenBitmask;
        this._effectBitmask = effectBitmask;
        this._position = position;
        this._rotation = rotation;
        this._caveFactor = caveFactor;
        this._muffleFactor = muffleFactor;
    }
    get PacketType() {
        return 8 /* McApiPacketType.OnEntityCreated */;
    }
    get Id() {
        return this._id;
    }
    get Loudness() {
        return this._loudness;
    }
    get LastSpoke() {
        return this._lastSpoke;
    }
    get WorldId() {
        return this._worldId;
    }
    get Name() {
        return this._name;
    }
    get Muted() {
        return this._muted;
    }
    get Deafened() {
        return this._deafened;
    }
    get TalkBitmask() {
        return this._talkBitmask;
    }
    get ListenBitmask() {
        return this._listenBitmask;
    }
    get EffectBitmask() {
        return this._effectBitmask;
    }
    get Position() {
        return this._position;
    }
    get Rotation() {
        return this._rotation;
    }
    get CaveFactor() {
        return this._caveFactor;
    }
    get MuffleFactor() {
        return this._muffleFactor;
    }
    _id;
    _loudness;
    _lastSpoke;
    _worldId;
    _name;
    _muted;
    _deafened;
    _talkBitmask;
    _listenBitmask;
    _effectBitmask;
    _position;
    _rotation;
    _caveFactor;
    _muffleFactor;
    Serialize(writer) {
        writer.PutInt(this.Id);
        writer.PutFloat(this.Loudness);
        writer.PutLong(BigInt(this.LastSpoke));
        writer.PutString(this.WorldId, MaxStringLength);
        writer.PutString(this.Name, MaxStringLength);
        writer.PutBool(this.Muted);
        writer.PutBool(this.Deafened);
        writer.PutUshort(this.TalkBitmask);
        writer.PutUshort(this.ListenBitmask);
        writer.PutUshort(this.EffectBitmask);
        writer.PutFloat(this.Position.X);
        writer.PutFloat(this.Position.Y);
        writer.PutFloat(this.Position.Z);
        writer.PutFloat(this.Rotation.X);
        writer.PutFloat(this.Rotation.Y);
        writer.PutFloat(this.CaveFactor);
        writer.PutFloat(this.MuffleFactor);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._loudness = reader.GetFloat();
        this._lastSpoke = reader.GetLong();
        this._worldId = reader.GetString();
        this._name = reader.GetString();
        this._muted = reader.GetBool();
        this._deafened = reader.GetBool();
        this._talkBitmask = reader.GetUshort();
        this._listenBitmask = reader.GetUshort();
        this._effectBitmask = reader.GetUshort();
        this._position = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
        this._rotation = new Vector2(reader.GetFloat(), reader.GetFloat());
        this._caveFactor = reader.GetFloat();
        this._muffleFactor = reader.GetFloat();
    }
}
