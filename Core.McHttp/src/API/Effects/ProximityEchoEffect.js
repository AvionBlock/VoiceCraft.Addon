import { EffectType } from "../Data/Enums";
export class ProximityEchoEffect {
    get EffectType() {
        return EffectType.ProximityEcho;
    }
    get Delay() {
        return this._delay;
    }
    set Delay(value) {
        this._delay = value;
    }
    get Range() {
        return this._range;
    }
    set Range(value) {
        this._range = value;
    }
    get WetDry() {
        return this._wetDry;
    }
    set WetDry(value) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }
    _delay = 0.5;
    _range = 0;
    _wetDry = 1;
    Serialize(writer) {
        writer.PutFloat(this._delay);
        writer.PutFloat(this._range);
        writer.PutFloat(this._wetDry);
    }
    Deserialize(reader) {
        this._delay = reader.GetFloat();
        this._range = reader.GetFloat();
        this._wetDry = reader.GetFloat();
    }
    Reset() {
        //Nothing to reset.
    }
}
