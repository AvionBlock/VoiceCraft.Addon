import { CustomForm, ObservableNumber, ObservableString } from "@minecraft/server-ui";
import { EchoEffect } from "../../../API/Effects/EchoEffect";
export class SetEchoEffectSettingsForm {
    _player;
    _aes;
    _form;
    _effect;
    _bitmask;
    _delay;
    _feedback;
    _wetDry;
    constructor(_player, _aes, editEffect) {
        this._player = _player;
        this._aes = _aes;
        const editMode = editEffect !== undefined;
        this._effect = editMode ? editEffect : new EchoEffect();
        this._bitmask = new ObservableString(this._effect.Bitmask.toString(), { clientWritable: true });
        this._delay = new ObservableNumber(this._effect.Delay, { clientWritable: true });
        this._feedback = new ObservableNumber(this._effect.Feedback, { clientWritable: true });
        this._wetDry = new ObservableNumber(this._effect.WetDry, { clientWritable: true });
        this._form = new CustomForm(this._player, `${editMode ? "Edit" : "Set"} Echo Effect`)
            .textField("Bitmask", this._bitmask, { disabled: editMode })
            .slider("Delay", this._delay, 0, 10, { step: 0.1 })
            .slider("Feedback", this._feedback, 0, 1, { step: 0.05 })
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
            const [bitmask, delay, feedback, wetDry] = this.GetData();
            this._effect.Bitmask = bitmask;
            this._effect.Delay = delay;
            this._effect.Feedback = feedback;
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
        const delay = this._delay.getData();
        if (delay < 0.0 || delay > 10.0)
            throw new Error("Invalid Delay! Delay must be at or between 0.0 and 10.0!");
        const feedback = this._feedback.getData();
        if (feedback < 0.0 || feedback > 1.0)
            throw new Error("Invalid Feedback! Feedback must be at or between 0.0 and 1.0!");
        const wetDry = this._wetDry.getData();
        if (wetDry < 0.0 || wetDry > 1.0)
            throw new Error("Invalid WetDry! WetDry must be at or between 0.0 and 1.0!");
        //Return Values
        return [bitmask, delay, feedback, wetDry];
    }
}
