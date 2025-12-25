import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Network/NetDataReader";
import {NetDataWriter} from "../Network/NetDataWriter";
import { EffectType } from "../Data/Enums";

export class DirectionalEffect implements IAudioEffect{
    get EffectType(): EffectType {
        return EffectType.Directional;
    }

    get WetDry(): number {
        return this._wetDry;
    }

    private _wetDry: number = 1;

    Serialize(writer: NetDataWriter): void {
        writer.PutFloat(this._wetDry)
    }

    Deserialize(reader: NetDataReader): void {
        this._wetDry = reader.GetFloat();
    }

    Reset(): void {
        //Nothing to reset.
    }
}