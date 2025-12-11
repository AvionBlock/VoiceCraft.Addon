export class ProximityEchoEffect {
    constructor(delay = 0.5, range = 0) {
        this._delay = delay;
        this._range = range;
    }
    get EffectType() {
        return 4 /* EffectType.ProximityEcho */;
    }
    get Delay() {
        return this._delay;
    }
    get Range() {
        return this._range;
    }
    get Wet() {
        return this._wet;
    }
    get Dry() {
        return this._dry;
    }
    _delay;
    _range;
    _wet = 1;
    _dry = 0;
    Serialize(writer) {
        writer.PutFloat(this._delay);
        writer.PutFloat(this._range);
        writer.PutFloat(this._wet);
        writer.PutFloat(this._dry);
    }
    Deserialize(reader) {
        this._delay = reader.GetFloat();
        this._range = reader.GetFloat();
        this._wet = reader.GetFloat();
        this._dry = reader.GetFloat();
    }
    Reset() {
        //Nothing to reset.
    }
}
