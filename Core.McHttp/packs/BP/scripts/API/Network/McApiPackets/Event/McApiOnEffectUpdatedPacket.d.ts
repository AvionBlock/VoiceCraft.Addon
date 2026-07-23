import { EffectType, EventType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
import { IAudioEffect } from "../../../Interfaces/IAudioEffect";
import { IMcApiEventPacket } from "../IMcApiEventPacket";
export declare class McApiOnEffectUpdatedPacket implements IMcApiEventPacket {
    constructor(bitmask?: number, effect?: IAudioEffect);
    get EventType(): EventType;
    get Bitmask(): number;
    get EffectType(): EffectType;
    get Effect(): IAudioEffect | undefined;
    private _bitmask;
    private _effect?;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(bitmask?: number, effect?: IAudioEffect): void;
}
