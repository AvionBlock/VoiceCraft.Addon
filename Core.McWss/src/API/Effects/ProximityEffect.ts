import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Network/NetDataReader";
import {NetDataWriter} from "../Network/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class ProximityEffect implements IAudioEffect {

    constructor(minRange: number = 0, maxRange: number = 0) {
        this._minRange = minRange;
        this._maxRange = maxRange;
    }

    get EffectType(): EffectType {
        return EffectType.Proximity;
    }

    get MinRange(): number {
        return this._minRange;
    }

    get MaxRange(): number {
        return this._maxRange;
    }

    private _minRange: number;
    private _maxRange: number;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._minRange);
        writer.PutFloat(this._maxRange);
    }

    Deserialize(reader: NetDataReader): void {
        this._minRange = reader.GetFloat();
        this._maxRange = reader.GetFloat();
    }

    Reset(): void {
        //Nothing to reset.
    }
}