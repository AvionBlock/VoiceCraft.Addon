import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Network/NetDataReader";
import { NetDataWriter } from "../Network/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class EchoEffect implements IAudioEffect {
    get EffectType(): EffectType;
    get Delay(): number;
    set Delay(value: number);
    get Feedback(): number;
    set Feedback(value: number);
    get WetDry(): number;
    set WetDry(value: number);
    private _delay;
    private _feedback;
    private _wetDry;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Reset(): void;
}
