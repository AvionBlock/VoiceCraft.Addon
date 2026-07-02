import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Data/NetDataReader";
import {NetDataWriter} from "../Data/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class ProximityMuffleEffect implements IAudioEffect {
    get EffectType(): EffectType {
        return EffectType.ProximityMuffle;
    }

    get Bitmask(): number {
        return this._bitmask;
    }
    set Bitmask(value: number) {
        this._bitmask = value;
    }

    get Factor(): number {
        return this._wetDry;
    }
    set Factor(value: number) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }

    get WetDry(): number {
        return this._wetDry;
    }
    set WetDry(value: number) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }

    private _bitmask: number = 65535;
    private _factor: number = 0;
    private _wetDry: number = 1;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._factor);
        writer.PutFloat(this._wetDry);
    }

    Deserialize(reader: NetDataReader): void {
        this._factor = reader.GetFloat();
        this._wetDry = reader.GetFloat();
    }
}