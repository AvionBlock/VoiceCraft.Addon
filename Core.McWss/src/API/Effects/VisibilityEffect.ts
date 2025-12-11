import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {NetDataReader} from "../Network/NetDataReader";
import {NetDataWriter} from "../Network/NetDataWriter";
import {EffectType} from "../Data/Enums";

export class VisibilityEffect implements IAudioEffect {
    get EffectType(): EffectType {
        return EffectType.Visibility;
    }

    Serialize(writer: NetDataWriter): void {
        //Nothing to write.
    }

    Deserialize(reader: NetDataReader): void {
        //Nothing to deserialize.
    }

    Reset(): void {
        //Nothing to reset.
    }
}