import { CustomForm } from "@minecraft/server-ui";
import { system } from "@minecraft/server";
import { GeneralSettingsForm } from "./Settings/GeneralSettingsForm";
import { EffectSettingsForm } from "./Settings/EffectSettingsForm";
import { AutoConnectSettingsForm } from "./Settings/AutoConnectSettingsForm";
import { PlayerSettingsForm } from "./Settings/PlayerSettingsForm";
export class SettingsForm {
    _player;
    _vc;
    _bs;
    _aes;
    _form;
    constructor(_player, _vc, _bs, _aes) {
        this._player = _player;
        this._vc = _vc;
        this._bs = _bs;
        this._aes = _aes;
        this._form = new CustomForm(this._player, "Settings")
            .spacer()
            .button("General", () => this.ShowGeneralSettings())
            .button("Effects", () => this.ShowEffectSettings())
            .button("Players", async () => this.ShowPlayerSettings())
            .button("Auto Connect", async () => this.ShowAutoConnectSettings())
            .closeButton();
    }
    async ShowAsync() {
        try {
            await this._form.show();
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }
    ShowGeneralSettings() {
        this._form.close();
        system.run(async () => await new GeneralSettingsForm(this._player).ShowAsync());
    }
    ShowEffectSettings() {
        this._form.close();
        system.run(async () => await new EffectSettingsForm(this._player, this._vc, this._aes).ShowAsync());
    }
    ShowPlayerSettings() {
        this._form.close();
        system.run(async () => await new PlayerSettingsForm(this._player, this._vc, this._bs).ShowAsync());
    }
    ShowAutoConnectSettings() {
        this._form.close();
        system.run(async () => await new AutoConnectSettingsForm(this._player).ShowAsync());
    }
}
