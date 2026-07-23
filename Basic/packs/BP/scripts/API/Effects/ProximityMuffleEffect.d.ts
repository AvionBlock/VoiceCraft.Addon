import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Data/NetDataReader";
import { NetDataWriter } from "../Data/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class ProximityMuffleEffect implements IAudioEffect {
    get EffectType(): EffectType;
    get Bitmask(): number;
    set Bitmask(value: number);
    get Factor(): number;
    set Factor(value: number);
    get WetDry(): number;
    set WetDry(value: number);
    private _bitmask;
    private _factor;
    private _wetDry;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
