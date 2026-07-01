import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Data/NetDataReader";
import { NetDataWriter } from "../Data/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class ProximityEffect implements IAudioEffect {
    get EffectType(): EffectType;
    get Bitmask(): number;
    set Bitmask(value: number);
    get MinRange(): number;
    set MinRange(value: number);
    get MaxRange(): number;
    set MaxRange(value: number);
    get WetDry(): number;
    set WetDry(value: number);
    private _bitmask;
    private _minRange;
    private _maxRange;
    private _wetDry;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
