import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Network/NetDataReader";
import {NetDataWriter} from "../Network/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class ProximityEchoEffect implements IAudioEffect {

    constructor(delay: number = 0.5, range: number = 0) {
        this._delay = delay;
        this._range = range;
    }

    get EffectType(): EffectType {
        return EffectType.ProximityEcho;
    }

    get Delay(): number {
        return this._delay;
    }

    get Range(): number {
        return this._range;
    }

    get Wet(): number {
        return this._wet;
    }

    get Dry(): number {
        return this._dry;
    }

    private _delay: number;
    private _range: number;
    private _wet: number = 1;
    private _dry: number = 0;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._delay);
        writer.PutFloat(this._range);
        writer.PutFloat(this._wet);
        writer.PutFloat(this._dry);
    }

    Deserialize(reader: NetDataReader): void {
        this._delay = reader.GetFloat();
        this._range = reader.GetFloat();
        this._wet = reader.GetFloat();
        this._dry = reader.GetFloat();
    }

    Reset(): void {
        //Nothing to reset.
    }
}