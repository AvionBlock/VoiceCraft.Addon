import {EffectType} from "../Data/Enums";
import {INetSerializable} from "./INetSerializable";

export interface IAudioEffect extends INetSerializable{
    EffectType: EffectType;
    Reset(): void;
}