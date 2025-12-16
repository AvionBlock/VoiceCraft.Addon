import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Network/NetDataReader";
import { NetDataWriter } from "../Network/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class EchoEffect implements IAudioEffect {
    constructor(delay?: number, feedback?: number);
    get EffectType(): EffectType;
    get Delay(): number;
    get Feedback(): number;
    get Wet(): number;
    get Dry(): number;
    private _delay;
    private _feedback;
    private _wet;
    private _dry;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Reset(): void;
}
