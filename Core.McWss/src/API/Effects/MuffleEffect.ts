import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Data/NetDataReader";
import {NetDataWriter} from "../Data/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class MuffleEffect implements IAudioEffect {
    get EffectType(): EffectType {
        return EffectType.Muffle;
    }

    get WetDry(): number {
        return this._wetDry;
    }
    set WetDry(value: number) {
        this._wetDry = Math.min(1, Math.max(value, 0));
    }

    private _wetDry: number = 1;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._wetDry);
    }

    Deserialize(reader: NetDataReader): void {
        this._wetDry = reader.GetFloat();
    }

    Reset(): void {
        //Nothing to reset.
    }
}