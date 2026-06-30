import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Data/NetDataReader";
import {NetDataWriter} from "../Data/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class VisibilityEffect implements IAudioEffect {
    get EffectType(): EffectType {
        return EffectType.Visibility;
    }

    get Bitmask(): number {
        return this._bitmask;
    }
    set Bitmask(value: number) {
        this._bitmask = value;
    }

    private _bitmask: number = 65535;

    Serialize(writer: NetDataWriter): void {
        //Nothing to write.
    }

    Deserialize(reader: NetDataReader): void {
        //Nothing to deserialize.
    }
}