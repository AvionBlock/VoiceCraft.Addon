import {Player} from "@minecraft/server";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";
import {ActionFormData} from "@minecraft/server-ui";
import {EffectType} from "../../../API/Data/Enums";

export class DeleteEffectSettingsForm {
    constructor(private _aes: AudioEffectSystem) {
    }

    private _form = () => {
        const form = new ActionFormData()
            .title("Delete Effect")
        const effects = [];
        for (const effect of this._aes.Effects.entries()) {
            const selectedEffect = effect[1];
            selectedEffect.Bitmask = effect[0];
            effects.push(selectedEffect);
            form.button(`${EffectType[selectedEffect.EffectType]}: ${selectedEffect.Bitmask}`);
        }
        return {effects: effects, form: form};
    }

    public async Show(player: Player) {
        const form = this._form();
        const {canceled, selection} = await form.form.show(player);
        if (canceled || selection === undefined) return;
        this._aes.SetEffect(form.effects[selection].Bitmask, undefined);
    }
}