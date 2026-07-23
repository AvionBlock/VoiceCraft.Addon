import {Player} from "@minecraft/server";
import {ActionFormData} from "@minecraft/server-ui";
import {EffectType} from "../../../API/Data/Enums";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";
import {SetVisibilityEffectSettingsForm} from "./SetVisibilityEffectSettingsForm";
import {VisibilityEffect} from "../../../API/Effects/VisibilityEffect";
import {ProximityEffect} from "../../../API/Effects/ProximityEffect";
import {DirectionalEffect} from "../../../API/Effects/DirectionalEffect";
import {ProximityEchoEffect} from "../../../API/Effects/ProximityEchoEffect";
import {EchoEffect} from "../../../API/Effects/EchoEffect";
import {ProximityMuffleEffect} from "../../../API/Effects/ProximityMuffleEffect";
import {MuffleEffect} from "../../../API/Effects/MuffleEffect";
import {SetProximityEffectSettingsForm} from "./SetProximityEffectSettingsForm";
import {SetDirectionalEffectSettingsForm} from "./SetDirectionalEffectSettingsForm";
import {SetProximityEchoEffectSettingsForm} from "./SetProximityEchoEffectSettingsForm";
import {SetEchoEffectSettingsForm} from "./SetEchoEffectSettingsForm";
import {SetProximityMuffleEffectSettingsForm} from "./SetProximityMuffleEffectSettingsForm";
import {SetMuffleEffectSettingsForm} from "./SetMuffleEffectSettingsForm";

export class EditEffectSettingsForm {
    constructor(private _aes: AudioEffectSystem) {
    }

    private _form = () => {
        const form = new ActionFormData()
            .title("Edit Effect")
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
        const selectedEffect = form.effects[selection];
        if (selectedEffect === undefined) return;

        switch (selectedEffect.constructor) {
            case VisibilityEffect:
                await new SetVisibilityEffectSettingsForm(this._aes).Show(player, selectedEffect as VisibilityEffect);
                break;
            case ProximityEffect:
                await new SetProximityEffectSettingsForm(this._aes).Show(player, selectedEffect as ProximityEffect);
                break;
            case DirectionalEffect:
                await new SetDirectionalEffectSettingsForm(this._aes).Show(player, selectedEffect as DirectionalEffect);
                break;
            case ProximityEchoEffect:
                await new SetProximityEchoEffectSettingsForm(this._aes).Show(player, selectedEffect as ProximityEchoEffect);
                break;
            case EchoEffect:
                await new SetEchoEffectSettingsForm(this._aes).Show(player, selectedEffect as EchoEffect);
                break;
            case ProximityMuffleEffect:
                await new SetProximityMuffleEffectSettingsForm(this._aes).Show(player, selectedEffect as ProximityMuffleEffect);
                break;
            case MuffleEffect:
                await new SetMuffleEffectSettingsForm(this._aes).Show(player, selectedEffect as MuffleEffect);
                break;
        }
    }
}