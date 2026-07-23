import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Data/NetDataReader";
import { NetDataWriter } from "../Data/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class VisibilityEffect implements IAudioEffect {
    get EffectType(): EffectType;
    get Bitmask(): number;
    set Bitmask(value: number);
    private _bitmask;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
