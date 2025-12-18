import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Network/NetDataReader";
import {NetDataWriter} from "../Network/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class EchoEffect implements IAudioEffect {

    constructor(delay: number = 0.5, feedback: number = 0.5) {
        this._delay = delay;
        this._feedback = feedback;
    }

    get EffectType(): EffectType {
        return EffectType.Echo;
    }

    get Delay(): number {
        return this._delay;
    }

    get Feedback(): number {
        return this._feedback;
    }

    get Wet(): number {
        return this._wet;
    }

    get Dry(): number {
        return this._dry;
    }

    private _delay: number;
    private _feedback: number;
    private _wet: number = 1;
    private _dry: number = 0;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._delay);
        writer.PutFloat(this._feedback);
        writer.PutFloat(this._wet);
        writer.PutFloat(this._dry);
    }

    Deserialize(reader: NetDataReader): void {
        this._delay = reader.GetFloat();
        this._feedback = reader.GetFloat();
        this._wet = reader.GetFloat();
        this._dry = reader.GetFloat();
    }

    Reset(): void {
        //Nothing to reset.
    }
}