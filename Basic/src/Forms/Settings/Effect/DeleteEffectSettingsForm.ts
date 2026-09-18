import {Player} from "@minecraft/server";
import {CustomForm} from "@minecraft/server-ui";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";
import {IAudioEffect} from "../../../API/Interfaces/IAudioEffect";
import {EffectType} from "../../../API/Data/Enums";

export class DeleteEffectSettingsForm {
    private _form: CustomForm;

    constructor(private _player: Player, private _aes: AudioEffectSystem) {
        this._form = new CustomForm(this._player, "Delete Effect")
            .spacer();

        for (const effect of this._aes.Effects.entries()) {
            const selectedEffect = effect[1];
            selectedEffect.Bitmask = effect[0];
            this._form.button(`${selectedEffect.Bitmask}: ${EffectType[selectedEffect.EffectType]}`,
                () => this.DeleteEffect(selectedEffect));
        }
        this._form.closeButton();
    }

    public async ShowAsync() {
        try {
            await this._form.show();
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }

    public DeleteEffect(effect: IAudioEffect) {
        try {
            this._aes.SetEffect(effect.Bitmask, undefined);
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
        finally {
            if(this._form.isShowing())
                this._form.close();
        }
    }
}