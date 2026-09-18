import {CustomForm} from "@minecraft/server-ui";
import {Player, system} from "@minecraft/server";
import {GeneralSettingsForm} from "./Settings/GeneralSettingsForm";
import {EffectSettingsForm} from "./Settings/EffectSettingsForm";
import {AutoConnectSettingsForm} from "./Settings/AutoConnectSettingsForm";
import {AudioEffectSystem} from "../API/Systems/AudioEffectSystem";
import {PlayerSettingsForm} from "./Settings/PlayerSettingsForm";
import {VoiceCraft} from "../API/VoiceCraft";
import {BindingSystem} from "../API/Systems/BindingSystem";

export class SettingsForm {
    private readonly _form;

    constructor(private _player: Player, private _vc: VoiceCraft, private _bs: BindingSystem, private _aes: AudioEffectSystem) {
        this._form = new CustomForm(this._player, "Settings")
            .spacer()
            .button("General", () => this.ShowGeneralSettings())
            .button("Effects", () => this.ShowEffectSettings())
            .button("Players", async () => this.ShowPlayerSettings())
            .button("Auto Connect", async () => this.ShowAutoConnectSettings())
            .closeButton();
    }

    public async ShowAsync() {
        try {
            await this._form.show();
        }
        catch (error) {
            if(this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }

    private ShowGeneralSettings() {
        this._form.close();
        system.run(async () => await new GeneralSettingsForm(this._player).ShowAsync());
    }

    private ShowEffectSettings() {
        this._form.close();
        system.run(async () => await new EffectSettingsForm(this._player, this._vc, this._aes).ShowAsync());
    }

    private ShowPlayerSettings() {
        this._form.close();
        system.run(async () => await new PlayerSettingsForm(this._player, this._vc, this._bs).ShowAsync());
    }

    private ShowAutoConnectSettings() {
        this._form.close();
        system.run(async () => await new AutoConnectSettingsForm(this._player).ShowAsync());
    }
}