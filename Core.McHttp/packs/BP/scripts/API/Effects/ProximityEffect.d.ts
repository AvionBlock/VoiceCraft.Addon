import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Network/NetDataReader";
import { NetDataWriter } from "../Network/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class ProximityEffect implements IAudioEffect {
    constructor(minRange?: number, maxRange?: number);
    get EffectType(): EffectType;
    get MinRange(): number;
    get MaxRange(): number;
    private _minRange;
    private _maxRange;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Reset(): void;
}
