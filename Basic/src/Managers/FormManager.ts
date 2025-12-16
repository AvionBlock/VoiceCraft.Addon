import {VoiceCraft} from "../API/VoiceCraft";
import {BindingManager} from "./BindingManager";
import {Player} from "@minecraft/server";
import {ActionFormData, ModalFormData} from "@minecraft/server-ui";
import {EffectsManager} from "./EffectsManager";
import {ProximityEffect} from "../API/Effects/ProximityEffect";
import {VisibilityEffect} from "../API/Effects/VisibilityEffect";
import {EffectType} from "../API/Data/Enums";
import {EchoEffect} from "../API/Effects/EchoEffect";
import {DirectionalEffect} from "../API/Effects/DirectionalEffect";
import {ProximityEchoEffect} from "../API/Effects/ProximityEchoEffect";

export class FormManager {
    private _mainMenuSettingsForm = () => new ActionFormData()
        .title("Settings")
        .button("Effects")
        .button("Players");

    private _effectsMenuSettingsForm = () => new ActionFormData()
        .title("Effects")
        .button("Set Effect")
        .button("Delete Effect");

    private _selectEffectMenuSettingsForm = () => new ActionFormData()
        .title("Select Effect")
        .button("Visibility")
        .button("Proximity")
        .button("Directional")
        .button("Proximity Echo")
        .button("Echo");

    private _setVisibilityEffectMenuSettingsForm = (bitmask: number) => new ModalFormData()
        .title("Set Visibility Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()});

    private _setProximityEffectMenuSettingsForm = (bitmask: number, min: number, max: number) => new ModalFormData()
        .title("Set Proximity Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .slider("Min Range", 0, 100, {defaultValue: min})
        .slider("Max Range", 0, 100, {defaultValue: max});

    private _setDirectionalEffectMenuSettingsForm = (bitmask: number) => new ModalFormData()
        .title("Set Directional Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})

    private _setProximityEchoEffectMenuSettingsForm = (bitmask: number, delay: number, range: number) => new ModalFormData()
        .title("Set Proximity Echo Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .textField("Delay", "0", {defaultValue: delay.toString()})
        .slider("Range", 0, 100, {defaultValue: range});

    private _setEchoEffectMenuSettingsForm = (bitmask: number, delay: number, feedback: number) => new ModalFormData()
        .title("Set Echo Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .textField("Delay", "0", {defaultValue: delay.toString()})
        .textField("Feedback", "0", {defaultValue: feedback.toString()});

    private _deleteEffectMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Delete Effect")
        const bitmasks = [];
        for (const effect of this._em.Effects.entries()) {
            bitmasks.push(effect[0]);
            form.button(`${EffectType[effect[1].EffectType]}: ${effect[0]}`);
        }
        return {bitmasks: bitmasks, form: form};
    }

    private _selectPlayerMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Select Player")
        const players = this._bm.GetBindedPlayers();
        for (const player of players) {
            form.button(`${player.name}`);
        }
        return {players: players, form: form};
    }

    private _selectPlayerActionMenuSettingsForm = (player: Player) => {
        return new ActionFormData()
            .title(`${player.name}`)
            .button("Kick");
    }

    constructor(private _vc: VoiceCraft, private _bm: BindingManager, private _em: EffectsManager) {
    }

    public async ShowMainMenuSettingsFormAsync(player: Player) {
        try {
            const {canceled, selection} = await this._mainMenuSettingsForm().show(player);
            if (canceled || selection === undefined) return;
            switch (selection) {
                case 0:
                    await this.ShowEffectSettingsFormAsync(player);
                    break;
                case 1:
                    await this.ShowSelectPlayerSettingsFormAsync(player);
                    break;
            }
        } catch (error) {
            player.sendMessage(`§c${error}`);
        }
    }

    public async ShowEffectSettingsFormAsync(player: Player) {
        const {canceled, selection} = await this._effectsMenuSettingsForm().show(player);
        if (canceled || selection === undefined) return;
        switch (selection) {
            case 0:
                await this.ShowSelectEffectMenuSettingsFormAsync(player);
                break;
            case 1:
                await this.ShowDeleteEffectSettingsFormAsync(player);
                break;
        }
    }

    public async ShowSelectEffectMenuSettingsFormAsync(player: Player) {
        const {canceled, selection} = await this._selectEffectMenuSettingsForm().show(player);
        if (canceled || selection === undefined) return;
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
        }
    }

    public async ShowSetVisibilityEffectMenuSettingsFormAsync(player: Player) {
        const {cancelationReason, formValues} = await this._setVisibilityEffectMenuSettingsForm(0).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue] = formValues;
        if (typeof bitmaskValue !== "string") return;
        const bitmask = Number.parseInt(bitmaskValue);
        this._em.SetEffect(bitmask, new VisibilityEffect());
    }

    public async ShowSetProximityEffectMenuSettingsFormAsync(player: Player) {
        const {cancelationReason, formValues} = await this._setProximityEffectMenuSettingsForm(0, 0, 100).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, minValue, maxValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof minValue !== "number" || typeof maxValue != "number") return;
        const bitmask = Number.parseInt(bitmaskValue);
        this._em.SetEffect(bitmask, new ProximityEffect(minValue, maxValue));
    }

    public async ShowSetDirectionalEffectMenuSettingsFormAsync(player: Player) {
        const {cancelationReason, formValues} = await this._setDirectionalEffectMenuSettingsForm(0).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue] = formValues;
        if (typeof bitmaskValue !== "string") return;
        const bitmask = Number.parseInt(bitmaskValue);
        this._em.SetEffect(bitmask, new DirectionalEffect());
    }

    public async ShowSetProximityEchoEffectMenuSettingsFormAsync(player: Player) {
        const {
            cancelationReason,
            formValues
        } = await this._setProximityEchoEffectMenuSettingsForm(0, 0.5, 30).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, delayValue, rangeValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof delayValue !== "string" || typeof rangeValue != "number") return;
        const bitmask = Number.parseInt(bitmaskValue);
        const delay = Number.parseFloat(delayValue);
        this._em.SetEffect(bitmask, new ProximityEchoEffect(delay, rangeValue));
    }

    public async ShowSetEchoEffectMenuSettingsFormAsync(player: Player) {
        const {cancelationReason, formValues} = await this._setEchoEffectMenuSettingsForm(0, 0.5, 0.5).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, delayValue, feedbackValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof delayValue !== "string" || typeof feedbackValue != "string") return;
        const bitmask = Number.parseInt(bitmaskValue);
        const delay = Number.parseFloat(delayValue);
        const feedback = Number.parseFloat(feedbackValue);
        this._em.SetEffect(bitmask, new EchoEffect(delay, feedback));
    }

    public async ShowDeleteEffectSettingsFormAsync(player: Player) {
        const form = this._deleteEffectMenuSettingsForm();
        const {canceled, selection} = await form.form.show(player);
        if (canceled || selection === undefined) return;
        this._em.SetEffect(form.bitmasks[selection], undefined);
    }

    public async ShowSelectPlayerSettingsFormAsync(player: Player) {
        const form = this._selectPlayerMenuSettingsForm();
        const {canceled, selection} = await form.form.show(player);
        if (canceled || selection === undefined) return;
        const selectedPlayer = form.players[selection];
        await this.ShowPlayerActionsSettingsFormAsync(player, selectedPlayer);
    }

    public async ShowPlayerActionsSettingsFormAsync(player: Player, selectedPlayer: Player) {
        const form = this._selectPlayerActionMenuSettingsForm(selectedPlayer);
        const {canceled, selection} = await form.show(player);
        if (canceled || selection === undefined) return;
        switch(selection)
        {
            case 0:
                throw new Error("Not implemented.");
        }
    }
}