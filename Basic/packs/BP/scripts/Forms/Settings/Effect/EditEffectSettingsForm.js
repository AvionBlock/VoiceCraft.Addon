import { system } from "@minecraft/server";
import { CustomForm } from "@minecraft/server-ui";
import { EffectType } from "../../../API/Data/Enums";
import { SetVisibilityEffectSettingsForm } from "./SetVisibilityEffectSettingsForm";
import { SetProximityEffectSettingsForm } from "./SetProximityEffectSettingsForm";
import { SetDirectionalEffectSettingsForm } from "./SetDirectionalEffectSettingsForm";
import { SetProximityEchoEffectSettingsForm } from "./SetProximityEchoEffectSettingsForm";
import { SetEchoEffectSettingsForm } from "./SetEchoEffectSettingsForm";
import { SetProximityMuffleEffectSettingsForm } from "./SetProximityMuffleEffectSettingsForm";
import { SetMuffleEffectSettingsForm } from "./SetMuffleEffectSettingsForm";
export class EditEffectSettingsForm {
    _player;
    _aes;
    _form;
    constructor(_player, _aes) {
        this._player = _player;
        this._aes = _aes;
        this._form = new CustomForm(this._player, "Edit Effect")
            .spacer();
        for (const effect of this._aes.Effects.entries()) {
            const selectedEffect = effect[1];
            selectedEffect.Bitmask = effect[0];
            this._form.button(`${selectedEffect.Bitmask}: ${EffectType[selectedEffect.EffectType]}`, () => this.ShowEditEffectSettings(selectedEffect));
        }
        this._form.closeButton();
    }
    async ShowAsync() {
        try {
            await this._form.show();
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }
    ShowEditEffectSettings(effect) {
        this._form.close();
        switch (effect.EffectType) {
            case EffectType.Visibility:
                system.run(async () => await new SetVisibilityEffectSettingsForm(this._player, this._aes, effect)
                    .ShowAsync());
                break;
            case EffectType.Proximity:
                system.run(async () => await new SetProximityEffectSettingsForm(this._player, this._aes, effect)
                    .ShowAsync());
                break;
            case EffectType.Directional:
                system.run(async () => await new SetDirectionalEffectSettingsForm(this._player, this._aes, effect)
                    .ShowAsync());
                break;
            case EffectType.ProximityEcho:
                system.run(async () => await new SetProximityEchoEffectSettingsForm(this._player, this._aes, effect)
                    .ShowAsync());
                break;
            case EffectType.Echo:
                system.run(async () => await new SetEchoEffectSettingsForm(this._player, this._aes, effect)
                    .ShowAsync());
                break;
            case EffectType.ProximityMuffle:
                system.run(async () => await new SetProximityMuffleEffectSettingsForm(this._player, this._aes, effect)
                    .ShowAsync());
                break;
            case EffectType.Muffle:
                system.run(async () => await new SetMuffleEffectSettingsForm(this._player, this._aes, effect)
                    .ShowAsync());
                break;
            case EffectType.None:
            default:
                break;
        }
    }
}
