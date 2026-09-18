import {CustomForm, ObservableNumber, ObservableString} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";
import {MuffleEffect} from "../../../API/Effects/MuffleEffect";

export class SetMuffleEffectSettingsForm {
    private readonly _form;
    private readonly _effect;
    private readonly _bitmask;
    private readonly _wetDry;

    constructor(private _player: Player, private _aes: AudioEffectSystem, editEffect?: MuffleEffect) {
        const editMode = editEffect !== undefined;
        this._effect = editMode? editEffect : new MuffleEffect();

        this._bitmask = new ObservableString(this._effect.Bitmask.toString(), {clientWritable: true});
        this._wetDry = new ObservableNumber(this._effect.WetDry, {clientWritable: true});

        this._form = new CustomForm(this._player, `${editMode? "Edit" : "Set"} Muffle Effect`)
            .textField("Bitmask", this._bitmask, { disabled: editMode })
            .slider("WetDry", this._wetDry, 0, 1, { step: 0.05 })
            .spacer()
            .button("Save", () => this.Save())
            .closeButton();
    }

    public async ShowAsync() {
        try {
            await this._form.show();
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }

    private Save() {
        try {
            const [bitmask, wetDry] = this.GetData();

            this._effect.Bitmask = bitmask;
            this._effect.WetDry = wetDry;
            this._aes.SetEffect(this._effect.Bitmask, this._effect);
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
        finally {
            if(this._form.isShowing())
                this._form.close();
        }
    }

    private GetData(): [number, number] {
        const bitmask = Number.parseInt(this._bitmask.getData());
        if (bitmask < 1 || bitmask > 65535)
            throw new Error("Invalid Bitmask! Bitmask must be greater than 0 or lower than 65535!");

        const wetDry = this._wetDry.getData();
        if (wetDry < 0.0 || wetDry > 1.0)
            throw new Error("Invalid WetDry! WetDry must be at or between 0.0 and 1.0!");

        //Return Values
        return [bitmask, wetDry];
    }
}