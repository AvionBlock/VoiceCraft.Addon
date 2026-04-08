import { EffectType } from "../Data/Enums";
export class EchoEffect {
    get EffectType() {
        return EffectType.Echo;
    }
    get Delay() {
        return this._delay;
    }
    set Delay(value) {
        this._delay = value;
    }
    get Feedback() {
        return this._feedback;
    }
    set Feedback(value) {
        this._feedback = value;
    }
    get WetDry() {
        return this._wetDry;
    }
    set WetDry(value) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }
    _delay = 0.5;
    _feedback = 0.5;
    _wetDry = 1;
    Serialize(writer) {
        writer.PutFloat(this._delay);
        writer.PutFloat(this._feedback);
        writer.PutFloat(this._wetDry);
    }
    Deserialize(reader) {
        this._delay = reader.GetFloat();
        this._feedback = reader.GetFloat();
        this._wetDry = reader.GetFloat();
    }
    Reset() {
        //Nothing to reset.
    }
}
