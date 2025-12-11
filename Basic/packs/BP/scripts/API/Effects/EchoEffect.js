export class EchoEffect {
    constructor(delay = 0.5, feedback = 0.5) {
        this._delay = delay;
        this._feedback = feedback;
    }
    get EffectType() {
        return 5 /* EffectType.Echo */;
    }
    get Delay() {
        return this._delay;
    }
    get Feedback() {
        return this._feedback;
    }
    get Wet() {
        return this._wet;
    }
    get Dry() {
        return this._dry;
    }
    _delay;
    _feedback;
    _wet = 1;
    _dry = 0;
    Serialize(writer) {
        writer.PutFloat(this._delay);
        writer.PutFloat(this._feedback);
        writer.PutFloat(this._wet);
        writer.PutFloat(this._dry);
    }
    Deserialize(reader) {
        this._delay = reader.GetFloat();
        this._feedback = reader.GetFloat();
        this._wet = reader.GetFloat();
        this._dry = reader.GetFloat();
    }
    Reset() {
        //Nothing to reset.
    }
}
