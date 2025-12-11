import { EffectType } from "../Data/Enums";
import { INetSerializable } from "../Network/INetSerializable";
export interface IAudioEffect extends INetSerializable {
    EffectType: EffectType;
    Reset(): void;
}
