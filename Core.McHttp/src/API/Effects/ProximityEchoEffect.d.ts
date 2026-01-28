import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Data/NetDataReader";
import { NetDataWriter } from "../Data/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class ProximityEchoEffect implements IAudioEffect {
    get EffectType(): EffectType;
    get Delay(): number;
    set Delay(value: number);
    get Range(): number;
    set Range(value: number);
    get WetDry(): number;
    set WetDry(value: number);
    private _delay;
    private _range;
    private _wetDry;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Reset(): void;
}
