import { EffectType } from "../Data/Enums";
export class DirectionalEffect {
    get EffectType() {
        return EffectType.Directional;
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
