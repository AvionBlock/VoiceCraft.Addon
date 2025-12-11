export class ProximityEffect {
    constructor(minRange = 0, maxRange = 0) {
        this._minRange = minRange;
        this._maxRange = maxRange;
    }
    get EffectType() {
        return 2 /* EffectType.Proximity */;
    }
    get MinRange() {
        return this._minRange;
    }
    get MaxRange() {
        return this._maxRange;
    }
    _minRange;
    _maxRange;
    Serialize(writer) {
        writer.PutFloat(this._minRange);
        writer.PutFloat(this._maxRange);
    }
    Deserialize(reader) {
        this._minRange = reader.GetFloat();
        this._maxRange = reader.GetFloat();
    }
    Reset() {
        //Nothing to reset.
    }
}
