import { ModalFormData } from "@minecraft/server-ui";
import { ProximityEffect } from "../../../API/Effects/ProximityEffect";
export class SetProximityEffectSettingsForm {
    _aes;
    constructor(_aes) {
        this._aes = _aes;
    }
    _form = (effect) => new ModalFormData()
        .title("Set Proximity Effect")
        .textField("Bitmask", "0", { defaultValue: effect.Bitmask.toString() })
        .slider("Min Range", 0, 100, { defaultValue: effect.MinRange })
        .slider("Max Range", 0, 100, { defaultValue: effect.MaxRange })
        .textField("WetDry", "1", { defaultValue: effect.WetDry.toString() });
    async Show(player, effect = new ProximityEffect()) {
        const { cancelationReason, formValues } = await this._form(effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmask, min, max, wetDry] = this.Validate(formValues);
        effect.Bitmask = bitmask;
        effect.MinRange = min;
        effect.MaxRange = max;
        effect.WetDry = wetDry;
        this._aes.SetEffect(effect.Bitmask, effect);
    }
    Validate(formValues) {
        //Extract Values
        const [bitmaskValue, minValue, maxValue, wetDryValue] = formValues;
        //Validate Values
        if (typeof bitmaskValue !== "string" ||
            typeof minValue !== "number" ||
            typeof maxValue != "number" ||
            typeof wetDryValue !== "string")
            throw new Error("Invalid Form Values!");
        const bitmask = Number.parseInt(bitmaskValue);
        if (bitmask < 1 || bitmask > 65535)
            throw new Error("Invalid Bitmask! Bitmask must be greater than 0 or lower than 65535!");
        const wetDry = Number.parseFloat(wetDryValue);
        if (wetDry < 0.0 || wetDry > 1.0)
            throw new Error("Invalid WetDry! WetDry must be at or between 0.0 and 1.0!");
        //Return Values
        return [bitmask, minValue, maxValue, wetDry];
    }
}
