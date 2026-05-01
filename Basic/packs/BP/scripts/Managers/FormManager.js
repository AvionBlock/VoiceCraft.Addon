import { VoiceCraft } from "../API/VoiceCraft";
import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { ProximityEffect } from "../API/Effects/ProximityEffect";
import { VisibilityEffect } from "../API/Effects/VisibilityEffect";
import { EffectType } from "../API/Data/Enums";
import { DirectionalEffect } from "../API/Effects/DirectionalEffect";
import { ProximityEchoEffect } from "../API/Effects/ProximityEchoEffect";
import { EchoEffect } from "../API/Effects/EchoEffect";
import { ProximityMuffleEffect } from "../API/Effects/ProximityMuffleEffect";
import { MuffleEffect } from "../API/Effects/MuffleEffect";
import { McApiDestroyEntityRequestPacket } from "../API/Network/McApiPackets/Request/McApiDestroyEntityRequestPacket";
import { Guid } from "../API/Data/Guid";
import { McApiSetEntityMuteRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityMuteRequestPacket";
import { McApiSetEntityDeafenRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityDeafenRequestPacket";
export class FormManager {
    _vc;
    _bs;
    _aes;
    _mainMenuSettingsForm = () => new ActionFormData()
        .title("Settings")
        .button("General")
        .button("Effects")
        .button("Players")
        .button("Auto Connect");
    _generalSettingsMenuForm = (caveEcho, underwaterMuffle) => new ModalFormData()
        .title("General Settings")
        .toggle("Enable Cave Echo", { defaultValue: caveEcho })
        .toggle("Enable Underwater Muffle", { defaultValue: underwaterMuffle });
    _effectsMenuSettingsForm = () => new ActionFormData()
        .title("Effects")
        .button("Set Effect")
        .button("Edit Effect")
        .button("Delete Effect");
    _autoConnectMenuSettingsForm = (ip, port, loginKey, startup, reconnect) => new ModalFormData()
        .title("Auto Connect")
        .textField("IP", "127.0.0.1", { defaultValue: ip })
        .textField("Port", "9050", { defaultValue: port.toString() })
        .textField("Login Key", "00000000-0000-0000-0000-000000000000", { defaultValue: loginKey })
        .toggle("Connect On Startup", { defaultValue: startup })
        .toggle("Auto Reconnect", { defaultValue: reconnect });
    _selectEffectMenuSettingsForm = () => new ActionFormData()
        .title("Select Effect")
        .button("Visibility")
        .button("Proximity")
        .button("Directional")
        .button("Proximity Echo")
        .button("Echo")
        .button("Proximity Muffle")
        .button("Muffle");
    _setVisibilityEffectMenuSettingsForm = (bitmask, _) => new ModalFormData()
        .title("Set Visibility Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() });
    _setProximityEffectMenuSettingsForm = (bitmask, effect) => new ModalFormData()
        .title("Set Proximity Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: effect.WetDry.toString() })
        .slider("Min Range", 0, 100, { defaultValue: effect.MinRange })
        .slider("Max Range", 0, 100, { defaultValue: effect.MaxRange });
    _setDirectionalEffectMenuSettingsForm = (bitmask, effect) => new ModalFormData()
        .title("Set Directional Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: effect.WetDry.toString() });
    _setProximityEchoEffectMenuSettingsForm = (bitmask, effect) => new ModalFormData()
        .title("Set Proximity Echo Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: effect.WetDry.toString() })
        .textField("Delay", "0", { defaultValue: effect.Delay.toString() })
        .slider("Range", 0, 100, { defaultValue: effect.Range });
    _setEchoEffectMenuSettingsForm = (bitmask, effect) => new ModalFormData()
        .title("Set Echo Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: effect.WetDry.toString() })
        .textField("Delay", "0", { defaultValue: effect.Delay.toString() })
        .textField("Feedback", "0", { defaultValue: effect.Feedback.toString() });
    _setProximityMuffleEffectMenuSettingsForm = (bitmask, effect) => new ModalFormData()
        .title("Set Proximity Muffle Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: effect.WetDry.toString() });
    _setMuffleEffectMenuSettingsForm = (bitmask, effect) => new ModalFormData()
        .title("Set Muffle Effect")
        .textField("Bitmask", "0", { defaultValue: bitmask.toString() })
        .textField("WetDry", "1", { defaultValue: effect.WetDry.toString() });
    _editEffectMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Edit Effect");
        const bitmasks = [];
        const effects = [];
        for (const effect of this._aes.Effects.entries()) {
            bitmasks.push(effect[0]);
            effects.push(effect[1]);
            form.button(`${EffectType[effect[1].EffectType]}: ${effect[0]}`);
        }
        return { bitmasks: bitmasks, effects: effects, form: form };
    };
    _deleteEffectMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Delete Effect");
        const bitmasks = [];
        for (const effect of this._aes.Effects.entries()) {
            bitmasks.push(effect[0]);
            form.button(`${EffectType[effect[1].EffectType]}: ${effect[0]}`);
        }
        return { bitmasks: bitmasks, form: form };
    };
    _selectPlayerMenuSettingsForm = () => {
        const form = new ActionFormData()
            .title("Select Player");
        const players = this._bs.BoundPlayers;
        for (const player of players) {
            form.button(`${player.name}`);
        }
        return { players: players, form: form };
    };
    _selectPlayerActionMenuSettingsForm = (player) => {
        return new ActionFormData()
            .title(`${player.name}`)
            .button("Kick")
            .button("Mute")
            .button("Unmute")
            .button("Deafen")
            .button("Undeafen");
    };
    constructor(_vc, _bs, _aes) {
        this._vc = _vc;
        this._bs = _bs;
        this._aes = _aes;
    }
    async ShowMainMenuSettingsFormAsync(player) {
        try {
            const { canceled, selection } = await this._mainMenuSettingsForm().show(player);
            if (canceled || selection === undefined)
                return;
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
        }
        catch (error) {
            player.sendMessage(`§c${error}`);
        }
    }
    async ShowGeneralSettingsFormAsync(player) {
        const caveEcho = world.getDynamicProperty(`${VoiceCraft.Namespace}:enableCaveEcho`) ?? false;
        const underwaterMuffle = world.getDynamicProperty(`${VoiceCraft.Namespace}:enableUnderwaterMuffle`) ?? false;
        const { cancelationReason, formValues } = await this._generalSettingsMenuForm(caveEcho, underwaterMuffle).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [caveEchoValue, underwaterMuffleValue] = formValues;
        if (typeof caveEchoValue !== "boolean" || typeof underwaterMuffleValue !== "boolean")
            return;
        world.setDynamicProperty(`${VoiceCraft.Namespace}:enableCaveEcho`, caveEchoValue);
        world.setDynamicProperty(`${VoiceCraft.Namespace}:enableUnderwaterMuffle`, underwaterMuffleValue);
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
                await this.ShowEditEffectMenuSettingsFormAsync(player);
                break;
            case 2:
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
    async ShowEditEffectMenuSettingsFormAsync(player) {
        const form = this._editEffectMenuSettingsForm();
        const { canceled, selection } = await form.form.show(player);
        if (canceled || selection === undefined)
            return;
        const selectedBitmask = form.bitmasks[selection];
        const selectedEffect = form.effects[selection];
        if (selectedEffect === undefined)
            return;
        switch (selectedEffect.constructor) {
            case VisibilityEffect:
                await this.ShowSetVisibilityEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect
                });
                break;
            case ProximityEffect:
                await this.ShowSetProximityEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect
                });
                break;
            case DirectionalEffect:
                await this.ShowSetDirectionalEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect
                });
                break;
            case ProximityEchoEffect:
                await this.ShowSetProximityEchoEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect
                });
                break;
            case EchoEffect:
                await this.ShowSetEchoEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect
                });
                break;
            case ProximityMuffleEffect:
                await this.ShowSetProximityMuffleEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect
                });
                break;
            case MuffleEffect:
                await this.ShowSetMuffleEffectMenuSettingsFormAsync(player, {
                    bitmask: selectedBitmask,
                    effect: selectedEffect
                });
                break;
        }
    }
    async ShowSetVisibilityEffectMenuSettingsFormAsync(player, effect = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new VisibilityEffect()
            };
        }
        const { cancelationReason, formValues } = await this._setVisibilityEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue] = formValues;
        if (typeof bitmaskValue !== "string")
            return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }
    async ShowSetProximityEffectMenuSettingsFormAsync(player, effect = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new ProximityEffect()
            };
        }
        const { cancelationReason, formValues } = await this._setProximityEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue, minValue, maxValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof minValue !== "number" || typeof maxValue != "number")
            return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        effect.effect.MinRange = minValue;
        effect.effect.MaxRange = maxValue;
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }
    async ShowSetDirectionalEffectMenuSettingsFormAsync(player, effect = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new DirectionalEffect()
            };
        }
        const { cancelationReason, formValues } = await this._setDirectionalEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string")
            return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }
    async ShowSetProximityEchoEffectMenuSettingsFormAsync(player, effect = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new ProximityEchoEffect()
            };
        }
        const { cancelationReason, formValues } = await this._setProximityEchoEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue, delayValue, rangeValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof delayValue !== "string" || typeof rangeValue != "number")
            return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        effect.effect.Delay = Number.parseFloat(delayValue);
        effect.effect.Range = rangeValue;
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }
    async ShowSetEchoEffectMenuSettingsFormAsync(player, effect = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new EchoEffect()
            };
        }
        const { cancelationReason, formValues } = await this._setEchoEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue, delayValue, feedbackValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string" || typeof delayValue !== "string" || typeof feedbackValue != "string")
            return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        effect.effect.Delay = Number.parseFloat(delayValue);
        effect.effect.Feedback = Number.parseFloat(feedbackValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }
    async ShowSetProximityMuffleEffectMenuSettingsFormAsync(player, effect = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new ProximityMuffleEffect()
            };
        }
        const { cancelationReason, formValues } = await this._setProximityMuffleEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string")
            return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }
    async ShowSetMuffleEffectMenuSettingsFormAsync(player, effect = undefined) {
        if (effect === undefined) {
            effect = {
                bitmask: 0,
                effect: new MuffleEffect()
            };
        }
        const { cancelationReason, formValues } = await this._setMuffleEffectMenuSettingsForm(effect.bitmask, effect.effect).show(player);
        if (cancelationReason !== undefined || formValues === undefined)
            return;
        const [bitmaskValue, wetDryValue] = formValues;
        if (typeof bitmaskValue !== "string" || typeof wetDryValue !== "string")
            return;
        effect.bitmask = Number.parseInt(bitmaskValue);
        effect.effect.WetDry = Number.parseFloat(wetDryValue);
        this._aes.SetEffect(effect.bitmask, effect.effect);
    }
    async ShowDeleteEffectSettingsFormAsync(player) {
        const form = this._deleteEffectMenuSettingsForm();
        const { canceled, selection } = await form.form.show(player);
        if (canceled || selection === undefined)
            return;
        this._aes.SetEffect(form.bitmasks[selection], undefined);
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
        let entityId = undefined;
        switch (selection) {
            case 0:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined)
                    return;
                this._vc.SendPacket(new McApiDestroyEntityRequestPacket(Guid.Create().toString(), entityId));
                break;
            case 1:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined)
                    return;
                this._vc.SendPacket(new McApiSetEntityMuteRequestPacket(entityId, true));
                break;
            case 2:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined)
                    return;
                this._vc.SendPacket(new McApiSetEntityMuteRequestPacket(entityId, false));
                break;
            case 3:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined)
                    return;
                this._vc.SendPacket(new McApiSetEntityDeafenRequestPacket(entityId, true));
                break;
            case 4:
                entityId = this._bs.GetBoundEntity(selectedPlayer.id);
                if (entityId === undefined)
                    return;
                this._vc.SendPacket(new McApiSetEntityDeafenRequestPacket(entityId, false));
                break;
        }
    }
    async ShowAutoConnectSettingsFormAsync(player) {
        const form = this._autoConnectMenuSettingsForm(world.getDynamicProperty("autoConnect:ip") ?? "", world.getDynamicProperty("autoConnect:port") ?? 0, world.getDynamicProperty("autoConnect:loginKey") ?? "", world.getDynamicProperty("autoConnect:startup") ?? false, world.getDynamicProperty("autoConnect:reconnect") ?? false);
        const { canceled, formValues } = await form.show(player);
        if (canceled || formValues === undefined)
            return;
        const [ipValue, portValue, loginKeyValue, startupValue, reconnectValue] = formValues;
        if (typeof ipValue !== "string" ||
            typeof portValue !== "string" ||
            typeof loginKeyValue !== "string" ||
            typeof startupValue !== "boolean" ||
            typeof reconnectValue !== "boolean")
            return;
        const port = Number.parseInt(portValue);
        if (port < 1 || port > 65535)
            throw new Error("Invalid Port!");
        world.setDynamicProperty("autoConnect:ip", ipValue);
        world.setDynamicProperty("autoConnect:port", port);
        world.setDynamicProperty("autoConnect:loginKey", loginKeyValue);
        world.setDynamicProperty("autoConnect:startup", startupValue);
        world.setDynamicProperty("autoConnect:reconnect", reconnectValue);
    }
}
