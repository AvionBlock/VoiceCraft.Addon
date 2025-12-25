import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Network/NetDataReader";
import { NetDataWriter } from "../Network/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class ProximityEffect implements IAudioEffect {
    get EffectType(): EffectType;
    get MinRange(): number;
    set MinRange(value: number);
    get MaxRange(): number;
    set MaxRange(value: number);
    get WetDry(): number;
    set WetDry(value: number);
    private _minRange;
    private _maxRange;
    private _wetDry;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Reset(): void;
}
