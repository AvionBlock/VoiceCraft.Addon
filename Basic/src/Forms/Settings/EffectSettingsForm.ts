import {CustomForm} from "@minecraft/server-ui";
import {Player, system} from "@minecraft/server";
import {AudioEffectSystem} from "../../API/Systems/AudioEffectSystem";
import {SetEffectSettingsForm} from "./Effect/SetEffectSettingsForm";
import {EditEffectSettingsForm} from "./Effect/EditEffectSettingsForm";
import {DeleteEffectSettingsForm} from "./Effect/DeleteEffectSettingsForm";
import {VoiceCraft} from "../../API/VoiceCraft";
import {McApiResetRequestPacket} from "../../API/Network/McApiPackets/Request/McApiResetRequestPacket";
import {Guid} from "../../API/Data/Guid";

export class EffectSettingsForm {
    private readonly _form;

    constructor(private _player: Player, private _vc: VoiceCraft, private _aes: AudioEffectSystem) {
        this._form = new CustomForm(this._player, "Effect Settings")
            .spacer()
            .button("Set Effect", () => this.ShowSetEffectSettings())
            .button("Edit Effect", () => this.ShowEditEffectSettings())
            .button("Delete Effect", () => this.ShowDeleteEffectSettings())
            .button("Reset Effects", () => this.ResetEffects())
            .closeButton();
    }

    public async ShowAsync() {
        try {
            await this._form.show();
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }

    private ShowSetEffectSettings() {
        this._form.close();
        system.run(async () => await new SetEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ShowEditEffectSettings() {
        this._form.close();
        system.run(async () => await new EditEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ShowDeleteEffectSettings() {
        this._form.close();
        system.run(async () => await new DeleteEffectSettingsForm(this._player, this._aes).ShowAsync());
    }

    private ResetEffects() {
        try {
            this._vc.SendPacket(new McApiResetRequestPacket(Guid.Create().toString()))
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        } finally {
            if (this._form.isShowing())
                this._form.close();
        }
    }
}