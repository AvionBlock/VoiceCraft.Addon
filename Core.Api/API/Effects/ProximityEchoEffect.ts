import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Network/NetDataReader";
import {NetDataWriter} from "../Network/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class ProximityEchoEffect implements IAudioEffect {
    get EffectType(): EffectType {
        return EffectType.ProximityEcho;
    }

    get Delay(): number {
        return this._delay;
    }
    set Delay(value: number) {
        this._delay = value;
    }

    get Range(): number {
        return this._range;
    }
    set Range(value: number) {
        this._range = value;
    }

    get WetDry(): number {
        return this._wetDry;
    }
    set WetDry(value: number) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }

    private _delay: number = 0.5;
    private _range: number = 0;
    private _wetDry: number = 1;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._delay);
        writer.PutFloat(this._range);
        writer.PutFloat(this._wetDry);
    }

    Deserialize(reader: NetDataReader): void {
        this._delay = reader.GetFloat();
        this._range = reader.GetFloat();
        this._wetDry = reader.GetFloat();
    }

    Reset(): void {
        //Nothing to reset.
    }
}