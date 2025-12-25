import { EffectType, McApiPacketType } from "../../../Data/Enums";
import { VisibilityEffect } from "../../../Effects/VisibilityEffect";
import { ProximityEffect } from "../../../Effects/ProximityEffect";
import { DirectionalEffect } from "../../../Effects/DirectionalEffect";
import { ProximityEchoEffect } from "../../../Effects/ProximityEchoEffect";
import { EchoEffect } from "../../../Effects/EchoEffect";
import { ProximityMuffleEffect } from "../../../Effects/ProximityMuffleEffect";
import { MuffleEffect } from "../../../Effects/MuffleEffect";
export class McApiOnEffectUpdatedPacket {
    constructor(bitmask = 0, effect) {
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? EffectType.None;
        this._effect = effect;
    }
    get PacketType() {
        return McApiPacketType.OnEffectUpdated;
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
        writer.PutByte(this._effect?.EffectType ?? EffectType.None);
        if (this._effect !== undefined)
            this._effect.Serialize(writer);
    }
    Deserialize(reader) {
        this._bitmask = reader.GetUshort();
        this._effectType = reader.GetByte();
        switch (this._effectType) {
            case EffectType.None:
                this._effect = undefined;
                break;
            case EffectType.Visibility:
                this._effect = new VisibilityEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.Proximity:
                this._effect = new ProximityEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.Directional:
                this._effect = new DirectionalEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.ProximityEcho:
                this._effect = new ProximityEchoEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.Echo:
                this._effect = new EchoEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.ProximityMuffle:
                this._effect = new ProximityMuffleEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.Muffle:
                this._effect = new MuffleEffect();
                this._effect.Deserialize(reader);
                break;
        }
    }
    Set(bitmask = 0, effect) {
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? EffectType.None;
        this._effect = effect;
        return this;
    }
}
