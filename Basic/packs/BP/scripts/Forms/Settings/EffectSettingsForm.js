import { CustomForm } from "@minecraft/server-ui";
import { system } from "@minecraft/server";
import { SetEffectSettingsForm } from "./Effect/SetEffectSettingsForm";
import { EditEffectSettingsForm } from "./Effect/EditEffectSettingsForm";
import { DeleteEffectSettingsForm } from "./Effect/DeleteEffectSettingsForm";
import { McApiResetRequestPacket } from "../../API/Network/McApiPackets/Request/McApiResetRequestPacket";
import { Guid } from "../../API/Data/Guid";
export class EffectSettingsForm {
    _player;
    _vc;
    _aes;
    _form;
    constructor(_player, _vc, _aes) {
        this._player = _player;
        this._vc = _vc;
        this._aes = _aes;
        this._form = new CustomForm(this._player, "Effect Settings")
            .spacer()
            .button("Set Effect", () => this.ShowSetEffectSettings())
            .button("Edit Effect", () => this.ShowEditEffectSettings())
            .button("Delete Effect", () => this.ShowDeleteEffectSettings())
            .button("Reset Effects", () => this.ResetEffects())
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
    ShowSetEffectSettings() {
        this._form.close();
        system.run(async () => await new SetEffectSettingsForm(this._player, this._aes).ShowAsync());
    }
    ShowEditEffectSettings() {
        this._form.close();
        system.run(async () => await new EditEffectSettingsForm(this._player, this._aes).ShowAsync());
    }
    ShowDeleteEffectSettings() {
        this._form.close();
        system.run(async () => await new DeleteEffectSettingsForm(this._player, this._aes).ShowAsync());
    }
    ResetEffects() {
        try {
            this._vc.SendPacket(new McApiResetRequestPacket(Guid.Create().toString()));
        }
        catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
        finally {
            if (this._form.isShowing())
                this._form.close();
        }
    }
}
