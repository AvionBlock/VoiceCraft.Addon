import { EffectType } from "../Data/Enums";
export class ProximityMuffleEffect {
    get EffectType() {
        return EffectType.ProximityMuffle;
    }
    get WetDry() {
        return this._wetDry;
    }
    set WetDry(value) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }
    _wetDry = 1;
    Serialize(writer) {
        writer.PutFloat(this._wetDry);
    }
    Deserialize(reader) {
        this._wetDry = reader.GetFloat();
    }
    Reset() {
        //Nothing to reset.
    }
}
