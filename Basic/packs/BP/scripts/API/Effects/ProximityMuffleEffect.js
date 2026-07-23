import { EffectType } from "../Data/Enums";
export class ProximityMuffleEffect {
    get EffectType() {
        return EffectType.ProximityMuffle;
    }
    get Bitmask() {
        return this._bitmask;
    }
    set Bitmask(value) {
        this._bitmask = value;
    }
    get Factor() {
        return this._wetDry;
    }
    set Factor(value) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }
    get WetDry() {
        return this._wetDry;
    }
    set WetDry(value) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }
    _bitmask = 65535;
    _factor = 0;
    _wetDry = 1;
    Serialize(writer) {
        writer.PutFloat(this._factor);
        writer.PutFloat(this._wetDry);
    }
    Deserialize(reader) {
        this._factor = reader.GetFloat();
        this._wetDry = reader.GetFloat();
    }
}
