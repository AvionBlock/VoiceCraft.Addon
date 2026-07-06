import {ActionFormData} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {SetEffectSettingsForm} from "./Effect/SetEffectSettingsForm";
import {AudioEffectSystem} from "../../API/Systems/AudioEffectSystem";
import {EditEffectSettingsForm} from "./Effect/EditEffectSettingsForm";
import {DeleteEffectSettingsForm} from "./Effect/DeleteEffectSettingsForm";

export class EffectSettingsForm {
    constructor(private _aes: AudioEffectSystem) {
    }

    private _form = () => new ActionFormData()
        .title("Effects")
        .button("Set Effect")
        .button("Edit Effect")
        .button("Delete Effect");

    public async Show(player: Player) {
        const {canceled, selection} = await this._form().show(player);
        if (canceled || selection === undefined) return;
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