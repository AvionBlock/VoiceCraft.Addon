import { ActionFormData } from "@minecraft/server-ui";
import { SetEffectSettingsForm } from "./Effect/SetEffectSettingsForm";
import { EditEffectSettingsForm } from "./Effect/EditEffectSettingsForm";
import { DeleteEffectSettingsForm } from "./Effect/DeleteEffectSettingsForm";
export class EffectSettingsForm {
    _aes;
    constructor(_aes) {
        this._aes = _aes;
    }
    _form = () => new ActionFormData()
        .title("Effects")
        .button("Set Effect")
        .button("Edit Effect")
        .button("Delete Effect");
    async Show(player) {
        const { canceled, selection } = await this._form().show(player);
        if (canceled || selection === undefined)
            return;
        switch (selection) {
            case 0:
                await new SetEffectSettingsForm(this._aes).Show(player);
                break;
            case 1:
                await new EditEffectSettingsForm(this._aes).Show(player);
                break;
            case 2:
                await new DeleteEffectSettingsForm(this._aes).Show(player);
                break;
        }
    }
}
