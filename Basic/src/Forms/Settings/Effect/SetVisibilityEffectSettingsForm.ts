import {ModalFormData} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {VisibilityEffect} from "../../../API/Effects/VisibilityEffect";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";

export class SetVisibilityEffectSettingsForm {
    constructor(private _aes: AudioEffectSystem) {
    }

    private _form = (effect: VisibilityEffect) => new ModalFormData()
        .title("Set Visibility Effect")
        .textField("Bitmask", "0", {defaultValue: effect.Bitmask.toString()});

    public async Show(player: Player, effect: VisibilityEffect = new VisibilityEffect()) {
        const {cancelationReason, formValues} = await this._form(effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmask] = this.Validate(formValues);

        effect.Bitmask = bitmask;
        this._aes.SetEffect(effect.Bitmask, effect);
    }

    private Validate(formValues: (string | number | boolean | undefined)[]): [number] {
        //Extract Values
        const [bitmaskValue] = formValues;

        //Validate Values
        if (typeof bitmaskValue !== "string")
            throw new Error("Invalid Form Values!");

        const bitmask = Number.parseInt(bitmaskValue);
        if (bitmask < 1 || bitmask > 65535)
            throw new Error("Invalid Bitmask! Bitmask must be greater than 0 or lower than 65535!");

        //Return Values
        return [bitmask];
    }
}