import { EffectType } from "../Data/Enums";
export class ProximityEffect {
    get EffectType() {
        return EffectType.Proximity;
    }
    get MinRange() {
        return this._minRange;
    }
    set MinRange(value) {
        this._minRange = value;
    }
    get MaxRange() {
        return this._maxRange;
    }
    set MaxRange(value) {
        this._maxRange = value;
    }
    get WetDry() {
        return this._wetDry;
    }
    set WetDry(value) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }
    _minRange = 0;
    _maxRange = 0;
    _wetDry = 1;
    Serialize(writer) {
        writer.PutFloat(this._minRange);
        writer.PutFloat(this._maxRange);
        writer.PutFloat(this._wetDry);
    }
    Deserialize(reader) {
        this._minRange = reader.GetFloat();
        this._maxRange = reader.GetFloat();
        this._wetDry = reader.GetFloat();
    }
    Reset() {
        //Nothing to reset.
    }
}
