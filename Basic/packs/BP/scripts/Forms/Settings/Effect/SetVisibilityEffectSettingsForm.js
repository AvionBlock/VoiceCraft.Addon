import { ModalFormData } from "@minecraft/server-ui";
import { VisibilityEffect } from "../../../API/Effects/VisibilityEffect";
export class SetVisibilityEffectSettingsForm {
    _aes;
    constructor(_aes) {
        this._aes = _aes;
    }
    _form = (effect) => new ModalFormData()
        .title("Set Visibility Effect")
        .textField("Bitmask", "0", { defaultValue: effect.Bitmask.toString() });
    async Show(player, effect = new VisibilityEffect()) {
        const { cancelationReason, formValues } = await this._form(effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmask] = this.Validate(formValues);
        effect.Bitmask = bitmask;
        this._aes.SetEffect(effect.Bitmask, effect);
    }
    Validate(formValues) {
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
