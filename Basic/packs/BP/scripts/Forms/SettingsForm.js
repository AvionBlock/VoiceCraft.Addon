import { ActionFormData } from "@minecraft/server-ui";
import { GeneralSettingsForm } from "./Settings/GeneralSettingsForm";
import { EffectSettingsForm } from "./Settings/EffectSettingsForm";
import { AutoConnectSettingsForm } from "./Settings/AutoConnectSettingsForm";
import { PlayerSettingsForm } from "./Settings/PlayerSettingsForm";
export class SettingsForm {
    _vc;
    _bs;
    _aes;
    constructor(_vc, _bs, _aes) {
        this._vc = _vc;
        this._bs = _bs;
        this._aes = _aes;
    }
    _form = () => new ActionFormData()
        .title("Settings")
        .button("General")
        .button("Effects")
        .button("Players")
        .button("Auto Connect");
    async Show(player) {
        try {
            const { canceled, selection } = await this._form().show(player);
            if (canceled || selection === undefined)
                return;
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
        }
        catch (error) {
            player.sendMessage(`§c${error}`);
        }
    }
}
