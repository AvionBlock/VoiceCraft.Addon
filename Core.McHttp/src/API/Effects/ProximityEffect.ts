import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Network/NetDataReader";
import {NetDataWriter} from "../Network/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class ProximityEffect implements IAudioEffect {
    get EffectType(): EffectType {
        return EffectType.Proximity;
    }

    get MinRange(): number {
        return this._minRange;
    }
    set MinRange(value: number) {
        this._minRange = value;
    }

    get MaxRange(): number {
        return this._maxRange;
    }
    set MaxRange(value: number) {
        this._maxRange = value;
    }

    get WetDry(): number {
        return this._wetDry;
    }
    set WetDry(value: number) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }

    private _minRange: number = 0;
    private _maxRange: number = 0;
    private _wetDry: number = 1;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._minRange);
        writer.PutFloat(this._maxRange);
        writer.PutFloat(this._wetDry);
    }

    Deserialize(reader: NetDataReader): void {
        this._minRange = reader.GetFloat();
        this._maxRange = reader.GetFloat();
        this._wetDry = reader.GetFloat();
    }

    Reset(): void {
        //Nothing to reset.
    }
}