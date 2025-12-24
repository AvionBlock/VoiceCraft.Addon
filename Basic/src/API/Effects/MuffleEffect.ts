import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Network/NetDataReader";
import {NetDataWriter} from "../Network/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class MuffleEffect implements IAudioEffect {
    get EffectType(): EffectType {
        return EffectType.Muffle;
    }

    get Wet(): number {
        return this._wet;
    }

    get Dry(): number {
        return this._dry;
    }

    private _wet: number = 1;
    private _dry: number = 0;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._wet);
        writer.PutFloat(this._dry);
    }

    Deserialize(reader: NetDataReader): void {
        this._wet = reader.GetFloat();
        this._dry = reader.GetFloat();
    }

    Reset(): void {
        //Nothing to reset.
    }
}