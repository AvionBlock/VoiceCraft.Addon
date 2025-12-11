import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { NetDataReader } from "../Network/NetDataReader";
import { NetDataWriter } from "../Network/NetDataWriter";
import { EffectType } from "../Data/Enums";
export declare class ProximityEchoEffect implements IAudioEffect {
    constructor(delay?: number, range?: number);
    get EffectType(): EffectType;
    get Delay(): number;
    get Range(): number;
    get Wet(): number;
    get Dry(): number;
    private _delay;
    private _range;
    private _wet;
    private _dry;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Reset(): void;
}
