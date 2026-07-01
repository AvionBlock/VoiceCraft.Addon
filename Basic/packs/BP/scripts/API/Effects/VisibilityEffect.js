import { EffectType } from "../Data/Enums";
export class VisibilityEffect {
    get EffectType() {
        return EffectType.Visibility;
    }
    get Bitmask() {
        return this._bitmask;
    }
    set Bitmask(value) {
        this._bitmask = value;
    }
    _bitmask = 65535;
    Serialize(writer) {
        //Nothing to write.
    }
    Deserialize(reader) {
        //Nothing to deserialize.
    }
}
