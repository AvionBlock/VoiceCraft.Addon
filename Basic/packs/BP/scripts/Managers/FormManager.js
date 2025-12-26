import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { ProximityEffect } from "../API/Effects/ProximityEffect";
import { VisibilityEffect } from "../API/Effects/VisibilityEffect";
import { EffectType } from "../API/Data/Enums";
import { DirectionalEffect } from "../API/Effects/DirectionalEffect";
import { ProximityEchoEffect } from "../API/Effects/ProximityEchoEffect";
import { EchoEffect } from "../API/Effects/EchoEffect";
import { ProximityMuffleEffect } from "../API/Effects/ProximityMuffleEffect";
import { MuffleEffect } from "../API/Effects/MuffleEffect";
export class FormManager {
    _vc;
    _bm;
    _em;
    _mainMenuSettingsForm = () => new ActionFormData()
        .title("Settings")
        .button("Effects")
        .button("Players");
    _effectsMenuSettingsForm = () => new ActionFormData()
        .title("Effects")
        .button("Set Effect")
        .button("Delete Effect");
    _selectEffectMenuSettingsForm = () => new ActionFormData()
        .title("Select Effect")
        .button("Visibility")
        .button("Proximity")
        .button("Directional")
        .button("Proximity Echo")
        .button("Echo")
        .button("Proximity Muffle")
        .button("Muffle");
    _setVisibilityEffectMenuSettingsForm = (bitmask) => new ModalFormData()
        .title("Set Visibility Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() });
    _setProximityEffectMenuSettingsForm = (bitmask, wetDry, min, max) => new ModalFormData()
        .title("Set Proximity Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: wetDry.toString() })
        .slider("Min Range", 0, 100, { defaultValue: min })
        .slider("Max Range", 0, 100, { defaultValue: max });
    _setDirectionalEffectMenuSettingsForm = (bitmask, wetDry) => new ModalFormData()
        .title("Set Directional Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: wetDry.toString() });
    _setProximityEchoEffectMenuSettingsForm = (bitmask, wetDry, delay, range) => new ModalFormData()
        .title("Set Proximity Echo Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: wetDry.toString() })
        .textField("Delay", "0", { defaultValue: delay.toString() })
        .slider("Range", 0, 100, { defaultValue: range });
    _setEchoEffectMenuSettingsForm = (bitmask, wetDry, delay, feedback) => new ModalFormData()
        .title("Set Echo Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: wetDry.toString() })
        .textField("Delay", "0", { defaultValue: delay.toString() })
        .textField("Feedback", "0", { defaultValue: feedback.toString() });
    _setProximityMuffleEffectMenuSettingsForm = (bitmask, wetDry) => new ModalFormData()
        .title("Set Proximity Muffle Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: wetDry.toString() });
    _setMuffleEffectMenuSettingsForm = (bitmask, wetDry) => new ModalFormData()
        .title("Set Muffle Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: wetDry.toString() });
    _deleteEffectMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Delete Effect");
        const bitmasks = [];
        for (const effect of this._em.Effects.entries()) {
            bitmasks.push(effect[0]);
            form.button(`${EffectType[effect[1].EffectType]}: ${effect[0]}`);
        }
        return { bitmasks: bitmasks, form: form };
    };
    _selectPlayerMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Select Player");
        const players = this._bm.GetBindedPlayers();
        for (const player of players) {
            form.button(`${player.name}`);
        }
        return { players: players, form: form };
    };
    _selectPlayerActionMenuSettingsForm = (player) => {
        return new ActionFormData()
            .title(`${player.name}`)
            .button("Kick");
    };
    constructor(_vc, _bm, _em) {
        this._vc = _vc;
        this._bm = _bm;
        this._em = _em;
    }
    async ShowMainMenuSettingsFormAsync(player) {
        try {
            const { canceled, selection } = await this._mainMenuSettingsForm().show(player);
            if (canceled || selection === undefined)
                return;
            switch (selection) {
                case 0:
                    await this.ShowEffectSettingsFormAsync(player);
                    break;
                case 1:
                    await this.ShowSelectPlayerSettingsFormAsync(player);
                    break;
            }
        }
        catch (error) {
            player.sendMessage(`§c${error}`);
        }
    }
    async ShowEffectSettingsFormAsync(player) {
        const { canceled, selection } = await this._effectsMenuSettingsForm().show(player);
        if (canceled || selection === undefined)
            return;
        switch (selection) {
            case 0:
                await this.ShowSelectEffectMenuSettingsFormAsync(player);
                break;
            case 1:
                await this.ShowDeleteEffectSettingsFormAsync(player);
                break;
        }
    }
    async ShowSelectEffectMenuSettingsFormAsync(player) {
        const { canceled, selection } = await this._selectEffectMenuSettingsForm().show(player);
        if (canceled || selection === undefined)
            return;
        switch (selection) {
            case 0:
                await this.ShowSetVisibilityEffectMenuSettingsFormAsync(player);
                break;
            case 1:
                await this.ShowSetProximityEffectMenuSettingsFormAsync(player);
                break;
            case 2:
                await this.ShowSetDirectionalEffectMenuSettingsFormAsync(player);
                break;
            case 3:
                await this.ShowSetProximityEchoEffectMenuSettingsFormAsync(player);
                break;
            case 4:
                await this.ShowSetEchoEffectMenuSettingsFormAsync(player);
                break;
            case 5:
                await this.ShowSetProximityMuffleEffectMenuSettingsFormAsync(player);
                break;
            case 6:
                await this.ShowSetMuffleEffectMenuSettingsFormAsync(player);
                break;
        }
    }
    async ShowSetVisibilityEffectMenuSettingsFormAsync(player) {
        const { cancelationReason, formValues } = await this._setVisibilityEffectMenuSettingsForm(0).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue] = formValues;
        if (typeof bitmaskValue !== "string")
            return;
        const bitmask = Number.parseInt(bitmaskValue);
        this._em.SetEffect(bitmask, new VisibilityEffect());
    }
    async ShowSetProximityEffectMenuSettingsFormAsync(player) {
        const { cancelationReason, formValues } = await this._setProximityEffectMenuSettingsForm(0, 1, 0, 100).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue, minValue, maxValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof minValue !== "number" || typeof maxValue != "number")
            return;
        const bitmask = Number.parseInt(bitmaskValue);
        const wetDry = Number.parseFloat(wetDryValue);
        const effect = new ProximityEffect();
        effect.WetDry = wetDry;
        effect.MinRange = minValue;
        effect.MaxRange = maxValue;
        this._em.SetEffect(bitmask, effect);
    }
    async ShowSetDirectionalEffectMenuSettingsFormAsync(player) {
        const { cancelationReason, formValues } = await this._setDirectionalEffectMenuSettingsForm(0, 1).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string")
            return;
        const bitmask = Number.parseInt(bitmaskValue);
        const wetDry = Number.parseFloat(wetDryValue);
        const effect = new DirectionalEffect();
        effect.WetDry = wetDry;
        this._em.SetEffect(bitmask, effect);
    }
    async ShowSetProximityEchoEffectMenuSettingsFormAsync(player) {
        const { cancelationReason, formValues } = await this._setProximityEchoEffectMenuSettingsForm(0, 1, 0.5, 30).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue, delayValue, rangeValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof delayValue !== "string" || typeof rangeValue != "number")
            return;
        const bitmask = Number.parseInt(bitmaskValue);
        const wetDry = Number.parseFloat(wetDryValue);
        const delay = Number.parseFloat(delayValue);
        const effect = new ProximityEchoEffect();
        effect.WetDry = wetDry;
        effect.Delay = delay;
        effect.Range = rangeValue;
        this._em.SetEffect(bitmask, effect);
    }
    async ShowSetEchoEffectMenuSettingsFormAsync(player) {
        const { cancelationReason, formValues } = await this._setEchoEffectMenuSettingsForm(0, 1, 0.5, 0.5).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue, delayValue, feedbackValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof delayValue !== "string" || typeof feedbackValue != "string")
            return;
        const bitmask = Number.parseInt(bitmaskValue);
        const wetDry = Number.parseFloat(wetDryValue);
        const delay = Number.parseFloat(delayValue);
        const feedback = Number.parseFloat(feedbackValue);
        const effect = new EchoEffect();
        effect.WetDry = wetDry;
        effect.Delay = delay;
        effect.Feedback = feedback;
        this._em.SetEffect(bitmask, effect);
    }
    async ShowSetProximityMuffleEffectMenuSettingsFormAsync(player) {
        const { cancelationReason, formValues } = await this._setProximityMuffleEffectMenuSettingsForm(0, 1).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string")
            return;
        const bitmask = Number.parseInt(bitmaskValue);
        const wetDry = Number.parseFloat(wetDryValue);
        const effect = new ProximityMuffleEffect();
        effect.WetDry = wetDry;
        this._em.SetEffect(bitmask, effect);
    }
    async ShowSetMuffleEffectMenuSettingsFormAsync(player) {
        const { cancelationReason, formValues } = await this._setMuffleEffectMenuSettingsForm(0, 1).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string")
            return;
        const bitmask = Number.parseInt(bitmaskValue);
        const wetDry = Number.parseFloat(wetDryValue);
        const effect = new MuffleEffect();
        effect.WetDry = wetDry;
        this._em.SetEffect(bitmask, effect);
    }
    async ShowDeleteEffectSettingsFormAsync(player) {
        const form = this._deleteEffectMenuSettingsForm();
        const { canceled, selection } = await form.form.show(player);
        if (canceled || selection === undefined)
            return;
        this._em.SetEffect(form.bitmasks[selection], undefined);
    }
    async ShowSelectPlayerSettingsFormAsync(player) {
        const form = this._selectPlayerMenuSettingsForm();
        const { canceled, selection } = await form.form.show(player);
        if (canceled || selection === undefined)
            return;
        const selectedPlayer = form.players[selection];
        await this.ShowPlayerActionsSettingsFormAsync(player, selectedPlayer);
    }
    async ShowPlayerActionsSettingsFormAsync(player, selectedPlayer) {
        const form = this._selectPlayerActionMenuSettingsForm(selectedPlayer);
        const { canceled, selection } = await form.show(player);
        if (canceled || selection === undefined)
            return;
        switch (selection) {
            case 0:
                throw new Error("Not implemented.");
        }
    }
}
