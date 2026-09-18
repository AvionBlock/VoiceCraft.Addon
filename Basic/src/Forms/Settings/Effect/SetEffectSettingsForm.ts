import {CustomForm} from "@minecraft/server-ui";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";
import {Player, system} from "@minecraft/server";
import {SetVisibilityEffectSettingsForm} from "./SetVisibilityEffectSettingsForm";
import {SetProximityMuffleEffectSettingsForm} from "./SetProximityMuffleEffectSettingsForm";
import {SetProximityEffectSettingsForm} from "./SetProximityEffectSettingsForm";
import {SetDirectionalEffectSettingsForm} from "./SetDirectionalEffectSettingsForm";
import {SetProximityEchoEffectSettingsForm} from "./SetProximityEchoEffectSettingsForm";
import {SetEchoEffectSettingsForm} from "./SetEchoEffectSettingsForm";
import {SetMuffleEffectSettingsForm} from "./SetMuffleEffectSettingsForm";

export class SetEffectSettingsForm {
    private _form: CustomForm;

    constructor(private _player: Player, private _aes: AudioEffectSystem) {
        this._form = new CustomForm(this._player, "Select Effect")
            .spacer()
            .button("Visibility Effect", () => this.ShowSetVisibilityEffectSettings())
            .button("Proximity Effect", () => this.ShowSetProximityEffectSettings())
            .button("Directional Effect", () => this.ShowSetDirectionalEffectSettings())
            .button("Proximity Echo Effect", () => this.ShowSetProximityEchoEffectSettings())
            .button("Echo Effect", () => this.ShowSetEchoEffectSettings())
            .button("Proximity Muffle Effect", () => this.ShowSetProximityMuffleEffectSettings())
            .button("Muffle Effect", () => this.ShowSetMuffleEffectSettings())
    }

    public async ShowAsync() {
        try {
            await this._form.show();
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }

    private ShowSetVisibilityEffectSettings() {
        this._form.close();
        system.run(async () => await new SetVisibilityEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ShowSetProximityEffectSettings() {
        this._form.close();
        system.run(async () => await new SetProximityEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ShowSetDirectionalEffectSettings() {
        this._form.close();
        system.run(async () => await new SetDirectionalEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ShowSetProximityEchoEffectSettings() {
        this._form.close();
        system.run(async () => await new SetProximityEchoEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ShowSetEchoEffectSettings() {
        this._form.close();
        system.run(async () => await new SetEchoEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ShowSetProximityMuffleEffectSettings() {
        this._form.close();
        system.run(async () => await new SetProximityMuffleEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ShowSetMuffleEffectSettings() {
        this._form.close();
        system.run(async () => await new SetMuffleEffectSettingsForm(this._player, this._aes).ShowAsync());
    }
}