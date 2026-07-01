import { EffectType, EventType } from "../../../Data/Enums";
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
        this._effect = effect;
    }
    get EventType() {
        return EventType.OnEffectUpdated;
    }
    get Bitmask() {
        return this._bitmask;
    }
    get EffectType() {
        return this._effect?.EffectType ?? EffectType.None;
    }
    get Effect() {
        return this._effect;
    }
    _bitmask;
    _effect;
    Serialize(writer) {
        writer.PutUshort(this._bitmask);
        writer.PutByte(this._effect?.EffectType ?? EffectType.None);
        if (this._effect !== undefined)
            this._effect.Serialize(writer);
    }
    Deserialize(reader) {
        this._bitmask = reader.GetUshort();
        const effectType = reader.GetByte();
        switch (effectType) {
            case EffectType.Visibility:
                this._effect = new VisibilityEffect();
                break;
            case EffectType.Proximity:
                this._effect = new ProximityEffect();
                break;
            case EffectType.Directional:
                this._effect = new DirectionalEffect();
                break;
            case EffectType.ProximityEcho:
                this._effect = new ProximityEchoEffect();
                break;
            case EffectType.Echo:
                this._effect = new EchoEffect();
                break;
            case EffectType.ProximityMuffle:
                this._effect = new ProximityMuffleEffect();
                break;
            case EffectType.Muffle:
                this._effect = new MuffleEffect();
                break;
            case EffectType.None:
            default:
                this._effect = undefined;
                break;
        }
        this._effect?.Deserialize(reader);
    }
    Set(bitmask = 0, effect) {
        this._bitmask = bitmask;
        this._effect = effect;
    }
}
