import {VoiceCraft} from "../API/VoiceCraft";
import {Player, world} from "@minecraft/server";
import {ActionFormData, ModalFormData} from "@minecraft/server-ui";
import {ProximityEffect} from "../API/Effects/ProximityEffect";
import {VisibilityEffect} from "../API/Effects/VisibilityEffect";
import {EffectType} from "../API/Data/Enums";
import {DirectionalEffect} from "../API/Effects/DirectionalEffect";
import {ProximityEchoEffect} from "../API/Effects/ProximityEchoEffect";
import {EchoEffect} from "../API/Effects/EchoEffect";
import {ProximityMuffleEffect} from "../API/Effects/ProximityMuffleEffect";
import {MuffleEffect} from "../API/Effects/MuffleEffect";
import {AudioEffectSystem} from "../API/Systems/AudioEffectSystem";
import {BindingSystem} from "../API/Systems/BindingSystem";
import {McApiDestroyEntityRequestPacket} from "../API/Network/McApiPackets/Request/McApiDestroyEntityRequestPacket";
import {Guid} from "../API/Data/Guid";
import {McApiSetEntityMuteRequestPacket} from "../API/Network/McApiPackets/Request/McApiSetEntityMuteRequestPacket";
import {McApiSetEntityDeafenRequestPacket} from "../API/Network/McApiPackets/Request/McApiSetEntityDeafenRequestPacket";

export class FormManager {
    private _mainMenuSettingsForm = () => new ActionFormData()
        .title("Settings")
        .button("General")
        .button("Effects")
        .button("Players")
        .button("Auto Connect");

    private _generalSettingsMenuForm = (caveEcho: boolean, underwaterMuffle: boolean) => new ModalFormData()
        .title("General Settings")
        .toggle("Enable Cave Echo", {defaultValue: caveEcho})
        .toggle("Enable Underwater Muffle", {defaultValue: underwaterMuffle});

    private _effectsMenuSettingsForm = () => new ActionFormData()
        .title("Effects")
        .button("Set Effect")
        .button("Edit Effect")
        .button("Delete Effect");

    private _autoConnectMenuSettingsForm = (ip: string, port: number, loginKey: string, startup: boolean, reconnect: boolean) => new ModalFormData()
        .title("Auto Connect")
        .textField("IP", "127.0.0.1", {defaultValue: ip})
        .textField("Port", "9050", {defaultValue: port.toString()})
        .textField("Login Key", "00000000-0000-0000-0000-000000000000", {defaultValue: loginKey})
        .toggle("Connect On Startup", {defaultValue: startup})
        .toggle("Auto Reconnect", {defaultValue: reconnect})

    private _selectEffectMenuSettingsForm = () => new ActionFormData()
        .title("Select Effect")
        .button("Visibility")
        .button("Proximity")
        .button("Directional")
        .button("Proximity Echo")
        .button("Echo")
        .button("Proximity Muffle")
        .button("Muffle")

    private _setVisibilityEffectMenuSettingsForm = (
        bitmask: number,
        _: VisibilityEffect) => new ModalFormData()
        .title("Set Visibility Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()});

    private _setProximityEffectMenuSettingsForm = (
        bitmask: number,
        effect: ProximityEffect) => new ModalFormData()
        .title("Set Proximity Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .textField("WetDry", "1", {defaultValue: effect.WetDry.toString()})
        .slider("Min Range", 0, 100, {defaultValue: effect.MinRange})
        .slider("Max Range", 0, 100, {defaultValue: effect.MaxRange});

    private _setDirectionalEffectMenuSettingsForm = (
        bitmask: number,
        effect: DirectionalEffect) => new ModalFormData()
        .title("Set Directional Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .textField("WetDry", "1", {defaultValue: effect.WetDry.toString()});

    private _setProximityEchoEffectMenuSettingsForm = (
        bitmask: number,
        effect: ProximityEchoEffect) => new ModalFormData()
        .title("Set Proximity Echo Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .textField("WetDry", "1", {defaultValue: effect.WetDry.toString()})
        .textField("Delay", "0", {defaultValue: effect.Delay.toString()})
        .slider("Range", 0, 100, {defaultValue: effect.Range});

    private _setEchoEffectMenuSettingsForm = (
        bitmask: number,
        effect: EchoEffect) => new ModalFormData()
        .title("Set Echo Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .textField("WetDry", "1", {defaultValue: effect.WetDry.toString()})
        .textField("Delay", "0", {defaultValue: effect.Delay.toString()})
        .textField("Feedback", "0", {defaultValue: effect.Feedback.toString()});

    private _setProximityMuffleEffectMenuSettingsForm = (
        bitmask: number,
        effect: ProximityMuffleEffect) => new ModalFormData()
        .title("Set Proximity Muffle Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .textField("WetDry", "1", {defaultValue: effect.WetDry.toString()});

    private _setMuffleEffectMenuSettingsForm = (
        bitmask: number,
        effect: MuffleEffect) => new ModalFormData()
        .title("Set Muffle Effect")
        .textField("Bitmask", "0", {defaultValue: bitmask.toString()})
        .textField("WetDry", "1", {defaultValue: effect.WetDry.toString()});

    private _editEffectMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Edit Effect")
        const bitmasks = [];
        const effects = [];
        for (const effect of this._aes.Effects.entries()) {
            bitmasks.push(effect[0]);
            effects.push(effect[1]);
            form.button(`${EffectType[effect[1].EffectType]}: ${effect[0]}`);
        }
        return {bitmasks: bitmasks, effects: effects, form: form};
    }

    private _deleteEffectMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Delete Effect")
        const bitmasks = [];
        for (const effect of this._aes.Effects.entries()) {
            bitmasks.push(effect[0]);
            form.button(`${EffectType[effect[1].EffectType]}: ${effect[0]}`);
        }
        return {bitmasks: bitmasks, form: form};
    }

    private _selectPlayerMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Select Player")
        const players = this._bs.BoundPlayers;
        for (const player of players) {
            form.button(`${player.name}`);
        }
        return {players: players, form: form};
    }

    private _selectPlayerActionMenuSettingsForm = (player: Player) => {
        return new ActionFormData()
            .title(`${player.name}`)
            .button("Kick")
            .button("Mute")
            .button("Unmute")
            .button("Deafen")
            .button("Undeafen");
    }

    constructor(private _vc: VoiceCraft, private _bs: BindingSystem, private _aes: AudioEffectSystem) {
    }

    public async ShowMainMenuSettingsFormAsync(player: Player) {
        try {
            const {canceled, selection} = await this._mainMenuSettingsForm().show(player);
            if (canceled || selection === undefined) return;
            switch (selection) {
                case 0:
                    await this.ShowGeneralSettingsFormAsync(player);
                    break;
                case 1:
                    await this.ShowEffectSettingsFormAsync(player);
                    break;
                case 2:
                    await this.ShowSelectPlayerSettingsFormAsync(player);
                    break;
                case 3:
                    await this.ShowAutoConnectSettingsFormAsync(player);
                    break;
            }
        } catch (error) {
            player.sendMessage(`§c${error}`);
        }
    }

    public async ShowGeneralSettingsFormAsync(player: Player) {
        const caveEcho = world.getDynamicProperty(`${VoiceCraft.Namespace}:enableCaveEcho`) as boolean ?? false;
        const underwaterMuffle = world.getDynamicProperty(`${VoiceCraft.Namespace}:enableUnderwaterMuffle`) as boolean ?? false;
        const {
            cancelationReason,
            formValues
        } = await this._generalSettingsMenuForm(caveEcho, underwaterMuffle).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [caveEchoValue, underwaterMuffleValue] = formValues;
        if (typeof caveEchoValue !== "boolean" || typeof underwaterMuffleValue !== "boolean") return;
        world.setDynamicProperty(`${VoiceCraft.Namespace}:enableCaveEcho`, caveEchoValue);
        world.setDynamicProperty(`${VoiceCraft.Namespace}:enableUnderwaterMuffle`, underwaterMuffleValue);
    }

    public async ShowEffectSettingsFormAsync(player: Player) {
        const {canceled, selection} = await this._effectsMenuSettingsForm().show(player);
        if (canceled || selection === undefined) return;
        switch (selection) {
            case 0:
                await this.ShowSelectEffectMenuSettingsFormAsync(player);
                break;
            case 1:
                await this.ShowEditEffectMenuSettingsFormAsync(player);
                break;
            case 2:
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
            case 5:
                await this.ShowSetProximityMuffleEffectMenuSettingsFormAsync(player);
                break;
            case 6:
                await this.ShowSetMuffleEffectMenuSettingsFormAsync(player);
                break;
        }
    }

    public async ShowEditEffectMenuSettingsFormAsync(player: Player) {
        const form = this._editEffectMenuSettingsForm();
        const {canceled, selection} = await form.form.show(player);
        if (canceled || selection === undefined) return;
        const selectedBitmask = form.bitmasks[selection];
        const selectedEffect = form.effects[selection];
        if (selectedEffect === undefined) return;
        switch (selectedEffect.constructor) {
            case VisibilityEffect:
                await this.ShowSetVisibilityEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect as VisibilityEffect
                });
                break;
            case ProximityEffect:
                await this.ShowSetProximityEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect as ProximityEffect
                });
                break;
            case DirectionalEffect:
                await this.ShowSetDirectionalEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect as DirectionalEffect
                });
                break;
            case ProximityEchoEffect:
                await this.ShowSetProximityEchoEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect as ProximityEchoEffect
                });
                break;
            case EchoEffect:
                await this.ShowSetEchoEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect as EchoEffect
                });
                break;
            case ProximityMuffleEffect:
                await this.ShowSetProximityMuffleEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect as ProximityMuffleEffect
                });
                break;
            case MuffleEffect:
                await this.ShowSetMuffleEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect as MuffleEffect
                });
                break;
        }
    }

    public async ShowSetVisibilityEffectMenuSettingsFormAsync(player: Player, effect: {
        bitmask: number, effect: VisibilityEffect
    } | undefined = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new VisibilityEffect()
            }
        }

        const {
            cancelationReason,
            formValues
        } = await this._setVisibilityEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue] = formValues;
        if (typeof bitmaskValue !== "string") return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }

    public async ShowSetProximityEffectMenuSettingsFormAsync(player: Player, effect: {
        bitmask: number, effect: ProximityEffect
    } | undefined = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new ProximityEffect()
            }
        }

        const {
            cancelationReason,
            formValues
        } = await this._setProximityEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, wetDryValue, minValue, maxValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof minValue !== "number" || typeof maxValue != "number") return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        effect.effect.MinRange = minValue;
        effect.effect.MaxRange = maxValue;
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }

    public async ShowSetDirectionalEffectMenuSettingsFormAsync(player: Player, effect: {
        bitmask: number, effect: DirectionalEffect
    } | undefined = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new DirectionalEffect()
            }
        }

        const {
            cancelationReason,
            formValues
        } = await this._setDirectionalEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string") return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }

    public async ShowSetProximityEchoEffectMenuSettingsFormAsync(player: Player, effect: {
        bitmask: number, effect: ProximityEchoEffect
    } | undefined = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new ProximityEchoEffect()
            }
        }

        const {
            cancelationReason,
            formValues
        } = await this._setProximityEchoEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, wetDryValue, delayValue, rangeValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof delayValue !== "string" || typeof rangeValue != "number") return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        effect.effect.Delay = Number.parseFloat(delayValue);
        effect.effect.Range = rangeValue;
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }

    public async ShowSetEchoEffectMenuSettingsFormAsync(player: Player, effect: {
        bitmask: number, effect: EchoEffect
    } | undefined = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new EchoEffect()
            }
        }

        const {
            cancelationReason,
            formValues
        } = await this._setEchoEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, wetDryValue, delayValue, feedbackValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof delayValue !== "string" || typeof feedbackValue != "string") return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        effect.effect.Delay = Number.parseFloat(delayValue);
        effect.effect.Feedback = Number.parseFloat(feedbackValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }

    public async ShowSetProximityMuffleEffectMenuSettingsFormAsync(player: Player, effect: {
        bitmask: number, effect: ProximityMuffleEffect
    } | undefined = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new ProximityMuffleEffect()
            }
        }

        const {
            cancelationReason,
            formValues
        } = await this._setProximityMuffleEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string") return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }

    public async ShowSetMuffleEffectMenuSettingsFormAsync(player: Player, effect: {
        bitmask: number, effect: MuffleEffect
    } | undefined = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new MuffleEffect()
            }
        }

        const {
            cancelationReason,
            formValues
        } = await this._setMuffleEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined) return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string") return;
        effect.bitmask = Number.parseInt(bitmaskValue)
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }

    public async ShowDeleteEffectSettingsFormAsync(player: Player) {
        const form = this._deleteEffectMenuSettingsForm();
        const {canceled, selection} = await form.form.show(player);
        if (canceled || selection === undefined) return;
        this._aes.SetEffect(form.bitmasks[selection], undefined);
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
        let entityId = undefined;
        switch (selection) {
            case 0:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiDestroyEntityRequestPacket(Guid.Create().toString(), entityId));
                break;
            case 1:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiSetEntityMuteRequestPacket(entityId, true));
                break;
            case 2:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiSetEntityMuteRequestPacket(entityId, false));
                break;
            case 3:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiSetEntityDeafenRequestPacket(entityId, true));
                break;
            case 4:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined) return;
                this._vc.SendPacket(new McApiSetEntityDeafenRequestPacket(entityId, false));
                break;
        }
    }

    public async ShowAutoConnectSettingsFormAsync(player: Player) {
        const form = this._autoConnectMenuSettingsForm(
            world.getDynamicProperty("autoConnect:ip") as string ?? "",
            world.getDynamicProperty("autoConnect:port") as number ?? 0,
            world.getDynamicProperty("autoConnect:loginKey") as string ?? "",
            world.getDynamicProperty("autoConnect:startup") as boolean ?? false,
            world.getDynamicProperty("autoConnect:reconnect") as boolean ?? false
        );
        const {canceled, formValues} = await form.show(player);
        if (canceled || formValues === undefined) return;
        const [ipValue, portValue, loginKeyValue, startupValue, reconnectValue] = formValues;
        if (typeof ipValue !== "string" ||
            typeof portValue !== "string" ||
            typeof loginKeyValue !== "string" ||
            typeof startupValue !== "boolean" ||
            typeof reconnectValue !== "boolean") return;
        const port = Number.parseInt(portValue);
        if(port < 1 || port > 65535)
            throw new Error("Invalid Port!");
        world.setDynamicProperty("autoConnect:ip", ipValue);
        world.setDynamicProperty("autoConnect:port", port);
        world.setDynamicProperty("autoConnect:loginKey", loginKeyValue);
        world.setDynamicProperty("autoConnect:startup", startupValue);
        world.setDynamicProperty("autoConnect:reconnect", reconnectValue);
    }
}