import { CustomForm } from "@minecraft/server-ui";
import { EffectType } from "../../../API/Data/Enums";
export class DeleteEffectSettingsForm {
    _player;
    _aes;
    _form;
    constructor(_player, _aes) {
        this._player = _player;
        this._aes = _aes;
        this._form = new CustomForm(this._player, "Delete Effect")
            .spacer();
        for (const effect of this._aes.Effects.entries()) {
            const selectedEffect = effect[1];
            selectedEffect.Bitmask = effect[0];
            this._form.button(`${selectedEffect.Bitmask}: ${EffectType[selectedEffect.EffectType]}`, () => this.DeleteEffect(selectedEffect));
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
    DeleteEffect(effect) {
        try {
            this._aes.SetEffect(effect.Bitmask, undefined);
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
        finally {
            if (this._form.isShowing())
                this._form.close();
        }
    }
}
