import { MaxStringLength } from "../../../Data/Constants";
export class McApiSetEffectRequestPacket {
    constructor(token = "", bitmask = 0, effect) {
        this._token = token;
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? 0 /* EffectType.None */;
        this._effect = effect;
    }
    get PacketType() {
        return 3 /* McApiPacketType.SetEffectRequest */;
    }
    get Token() {
        return this._token;
    }
    get Bitmask() {
        return this._bitmask;
    }
    get EffectType() {
        return this._effectType;
    }
    get Effect() {
        return this._effect;
    }
    _token;
    _bitmask;
    _effectType;
    _effect;
    Serialize(writer) {
        writer.PutString(this._token, MaxStringLength);
        writer.PutUshort(this._bitmask);
        writer.PutByte(this._effect?.EffectType ?? 0 /* EffectType.None */);
        if (this._effect !== undefined)
            this._effect.Serialize(writer);
    }
    Deserialize(reader) {
        this._token = reader.GetString(MaxStringLength);
        this._bitmask = reader.GetUshort();
        this._effectType = reader.GetByte();
    }
    Set(token = "", bitmask = 0, effect) {
        this._token = token;
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? 0 /* EffectType.None */;
        this._effect = effect;
        return this;
    }
}
