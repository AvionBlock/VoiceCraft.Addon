import { CustomForm, ObservableNumber, ObservableString } from "@minecraft/server-ui";
import { ProximityMuffleEffect } from "../../../API/Effects/ProximityMuffleEffect";
export class SetProximityMuffleEffectSettingsForm {
    _player;
    _aes;
    _form;
    _effect;
    _bitmask;
    _factor;
    _wetDry;
    constructor(_player, _aes, editEffect) {
        this._player = _player;
        this._aes = _aes;
        const editMode = editEffect !== undefined;
        this._effect = editMode ? editEffect : new ProximityMuffleEffect();
        this._bitmask = new ObservableString(this._effect.Bitmask.toString(), { clientWritable: true });
        this._factor = new ObservableNumber(this._effect.Factor, { clientWritable: true });
        this._wetDry = new ObservableNumber(this._effect.WetDry, { clientWritable: true });
        this._form = new CustomForm(this._player, `${editMode ? "Edit" : "Set"} Proximity Muffle Effect`)
            .textField("Bitmask", this._bitmask, { disabled: editMode })
            .slider("Factor", this._factor, 0, 1, { step: 0.05 })
            .slider("WetDry", this._wetDry, 0, 1, { step: 0.05 })
            .spacer()
            .button("Save", () => this.Save())
            .closeButton();
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
    Save() {
        try {
            const [bitmask, factor, wetDry] = this.GetData();
            this._effect.Bitmask = bitmask;
            this._effect.Factor = factor;
            this._effect.WetDry = wetDry;
            this._aes.SetEffect(this._effect.Bitmask, this._effect);
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
    GetData() {
        const bitmask = Number.parseInt(this._bitmask.getData());
        if (bitmask < 1 || bitmask > 65535)
            throw new Error("Invalid Bitmask! Bitmask must be greater than 0 or lower than 65535!");
        const factor = this._factor.getData();
        if (factor < 0.0 || factor > 1.0)
            throw new Error("Invalid Factor! Factor must be at or between 0.0 and 1.0!");
        const wetDry = this._wetDry.getData();
        if (wetDry < 0.0 || wetDry > 1.0)
            throw new Error("Invalid WetDry! WetDry must be at or between 0.0 and 1.0!");
        //Return Values
        return [bitmask, factor, wetDry];
    }
}
