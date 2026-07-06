import { ModalFormData } from "@minecraft/server-ui";
import { ProximityEchoEffect } from "../../../API/Effects/ProximityEchoEffect";
export class SetProximityEchoEffectSettingsForm {
    _aes;
    constructor(_aes) {
        this._aes = _aes;
    }
    _form = (effect) => new ModalFormData()
        .title("Set Proximity Echo Effect")
        .textField("Bitmask", "0", { defaultValue: effect.Bitmask.toString() })
        .textField("Delay", "0", { defaultValue: effect.Delay.toString() })
        .slider("Range", 0, 100, { defaultValue: effect.Range })
        .textField("Factor", "0", { defaultValue: effect.Factor.toString() })
        .textField("WetDry", "1", { defaultValue: effect.WetDry.toString() });
    async Show(player, effect = new ProximityEchoEffect()) {
        const { cancelationReason, formValues } = await this._form(effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmask, delay, range, factor, wetDry] = this.Validate(formValues);
        effect.Bitmask = bitmask;
        effect.Delay = delay;
        effect.Range = range;
        effect.Factor = factor;
        effect.WetDry = wetDry;
        this._aes.SetEffect(effect.Bitmask, effect);
    }
    Validate(formValues) {
        //Extract Values
        const [bitmaskValue, delayValue, rangeValue, factorValue, wetDryValue] = formValues;
        //Validate Values
        if (typeof bitmaskValue !== "string" ||
            typeof delayValue !== "string" ||
            typeof rangeValue != "number" ||
            typeof factorValue !== "string" ||
            typeof wetDryValue !== "string")
            throw new Error("Invalid Form Values!");
        const bitmask = Number.parseInt(bitmaskValue);
        if (bitmask < 1 || bitmask > 65535)
            throw new Error("Invalid Bitmask! Bitmask must be greater than 0 or lower than 65535!");
        const delay = Number.parseFloat(delayValue);
        if (delay < 0.0 || delay > 10.0)
            throw new Error("Invalid Delay! Delay must be at or between 0.0 and 10.0!");
        const factor = Number.parseFloat(factorValue);
        if (factor < 0.0 || factor > 1.0)
            throw new Error("Invalid Factor! Factor must be at or between 0.0 and 1.0!");
        const wetDry = Number.parseFloat(wetDryValue);
        if (wetDry < 0.0 || wetDry > 1.0)
            throw new Error("Invalid WetDry! WetDry must be at or between 0.0 and 1.0!");
        //Return Values
        return [bitmask, delay, rangeValue, factor, wetDry];
    }
}
