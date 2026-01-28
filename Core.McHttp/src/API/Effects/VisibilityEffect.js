import { EffectType } from "../Data/Enums";
export class VisibilityEffect {
    get EffectType() {
        return EffectType.Visibility;
    }
    Serialize(writer) {
        //Nothing to write.
    }
    Deserialize(reader) {
        //Nothing to deserialize.
    }
    Reset() {
        //Nothing to reset.
    }
}
