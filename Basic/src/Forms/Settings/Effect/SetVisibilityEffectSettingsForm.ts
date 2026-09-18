import {CustomForm, ObservableString} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {VisibilityEffect} from "../../../API/Effects/VisibilityEffect";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";

export class SetVisibilityEffectSettingsForm {
    private readonly _form;
    private readonly _effect;
    private readonly _bitmask;

    constructor(private _player: Player, private _aes: AudioEffectSystem, editEffect?: VisibilityEffect) {
        const editMode = editEffect !== undefined;
        this._effect = editMode? editEffect : new VisibilityEffect();

        this._bitmask = new ObservableString(this._effect.Bitmask.toString(), {clientWritable: true});

        this._form = new CustomForm(this._player, `${editMode? "Edit" : "Set"} Visibility Effect`)
            .textField("Bitmask", this._bitmask, { disabled: editMode })
            .spacer()
            .button("Save", () => this.Save())
            .closeButton()
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
            const [bitmask] = this.GetData();

            this._effect.Bitmask = bitmask;
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

    private GetData(): [number] {
        const bitmask = Number.parseInt(this._bitmask.getData());
        if (bitmask < 1 || bitmask > 65535)
            throw new Error("Invalid Bitmask! Bitmask must be greater than 0 or lower than 65535!");

        //Return Values
        return [bitmask];
    }
}