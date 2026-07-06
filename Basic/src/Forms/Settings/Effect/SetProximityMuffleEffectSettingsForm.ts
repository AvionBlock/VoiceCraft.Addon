import {ModalFormData} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {ProximityMuffleEffect} from "../../../API/Effects/ProximityMuffleEffect";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";

export class SetProximityMuffleEffectSettingsForm {
    constructor(private _aes: AudioEffectSystem) {
    }

    private _form = (effect: ProximityMuffleEffect) => new ModalFormData()
        .title("Set Proximity Muffle Effect")
        .textField("Bitmask", "0", {defaultValue: effect.Bitmask.toString()})
        .textField("Factor", "1", {defaultValue: effect.Factor.toString()})
        .textField("WetDry", "1", {defaultValue: effect.WetDry.toString()});

    public async Show(player: Player, effect: ProximityMuffleEffect = new ProximityMuffleEffect()) {
        const {cancelationReason, formValues} = await this._form(effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmask, factor, wetDry] = this.Validate(formValues);

        effect.Bitmask = bitmask;
        effect.Factor = factor;
        effect.WetDry = wetDry;
        this._aes.SetEffect(effect.Bitmask, effect);
    }

    private Validate(formValues: (string | number | boolean | undefined)[]): [number, number, number] {
        //Extract Values
        const [bitmaskValue, factorValue, wetDryValue] = formValues;

        //Validate Values
        if (typeof bitmaskValue !== "string" ||
            typeof factorValue !== "string" ||
            typeof wetDryValue !== "string")
            throw new Error("Invalid Form Values!");

        const bitmask = Number.parseInt(bitmaskValue);
        if (bitmask < 1 || bitmask > 65535)
            throw new Error("Invalid Bitmask! Bitmask must be greater than 0 or lower than 65535!");

        const factor = Number.parseFloat(factorValue);
        if (factor < 0.0 || factor > 1.0)
            throw new Error("Invalid Factor! Factor must be at or between 0.0 and 1.0!");

        const wetDry = Number.parseFloat(wetDryValue);
        if (wetDry < 0.0 || wetDry > 1.0)
            throw new Error("Invalid WetDry! WetDry must be at or between 0.0 and 1.0!");

        //Return Values
        return [bitmask, factor, wetDry];
    }
}