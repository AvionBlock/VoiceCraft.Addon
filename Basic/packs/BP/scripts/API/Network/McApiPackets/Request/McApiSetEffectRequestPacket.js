export class McApiSetEffectRequestPacket {
    constructor(bitmask = 0, effect) {
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? 0 /* EffectType.None */;
        this._effect = effect;
    }
    get PacketType() {
        return 3 /* McApiPacketType.SetEffectRequest */;
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
    _bitmask;
    _effectType;
    _effect;
    Serialize(writer) {
        writer.PutUshort(this._bitmask);
        writer.PutByte(this._effect?.EffectType ?? 0 /* EffectType.None */);
        if (this._effect !== undefined)
            this._effect.Serialize(writer);
    }
    Deserialize(reader) {
        this._bitmask = reader.GetUshort();
        this._effectType = reader.GetByte();
    }
    Set(bitmask = 0, effect) {
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? 0 /* EffectType.None */;
        this._effect = effect;
        return this;
    }
}
