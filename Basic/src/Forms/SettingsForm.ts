import {ActionFormData} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {GeneralSettingsForm} from "./Settings/GeneralSettingsForm";
import {EffectSettingsForm} from "./Settings/EffectSettingsForm";
import {AutoConnectSettingsForm} from "./Settings/AutoConnectSettingsForm";
import {AudioEffectSystem} from "../API/Systems/AudioEffectSystem";
import {PlayerSettingsForm} from "./Settings/PlayerSettingsForm";
import {VoiceCraft} from "../API/VoiceCraft";
import {BindingSystem} from "../API/Systems/BindingSystem";

export class SettingsForm {
    constructor(private _vc: VoiceCraft, private _bs: BindingSystem, private _aes: AudioEffectSystem) {
    }

    private _form = () => new ActionFormData()
        .title("Settings")
        .button("General")
        .button("Effects")
        .button("Players")
        .button("Auto Connect");

    public async Show(player: Player) {
        try {
            const {canceled, selection} = await this._form().show(player);
            if (canceled || selection === undefined) return;
            switch (selection) {
                case 0:
                    await new GeneralSettingsForm().Show(player);
                    break;
                case 1:
                    await new EffectSettingsForm(this._aes).Show(player);
                    break;
                case 2:
                    await new PlayerSettingsForm(this._vc, this._bs).Show(player);
                    break;
                case 3:
                    await new AutoConnectSettingsForm().Show(player);
                    break;
            }
        } catch (error) {
            player.sendMessage(`§c${error}`);
        }
    }
}