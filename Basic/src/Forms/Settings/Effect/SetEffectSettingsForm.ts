import {ActionFormData} from "@minecraft/server-ui";
import {Player} from "@minecraft/server";
import {SetVisibilityEffectSettingsForm} from "./SetVisibilityEffectSettingsForm";
import {SetProximityEffectSettingsForm} from "./SetProximityEffectSettingsForm";
import {SetDirectionalEffectSettingsForm} from "./SetDirectionalEffectSettingsForm";
import {SetProximityEchoEffectSettingsForm} from "./SetProximityEchoEffectSettingsForm";
import {SetEchoEffectSettingsForm} from "./SetEchoEffectSettingsForm";
import {SetProximityMuffleEffectSettingsForm} from "./SetProximityMuffleEffectSettingsForm";
import {SetMuffleEffectSettingsForm} from "./SetMuffleEffectSettingsForm";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";

export class SetEffectSettingsForm {
    constructor(private _aes: AudioEffectSystem) {
    }

    private _form = () => new ActionFormData()
        .title("Select Effect")
        .button("Visibility")
        .button("Proximity")
        .button("Directional")
        .button("Proximity Echo")
        .button("Echo")
        .button("Proximity Muffle")
        .button("Muffle")

    public async Show(player: Player) {
        const {canceled, selection} = await this._form().show(player);
        if (canceled || selection === undefined) return;
        switch (selection) {
            case 0:
                await new SetVisibilityEffectSettingsForm(this._aes).Show(player);
                break;
            case 1:
                await new SetProximityEffectSettingsForm(this._aes).Show(player);
                break;
            case 2:
                await new SetDirectionalEffectSettingsForm(this._aes).Show(player);
                break;
            case 3:
                await new SetProximityEchoEffectSettingsForm(this._aes).Show(player);
                break;
            case 4:
                await new SetEchoEffectSettingsForm(this._aes).Show(player);
                break;
            case 5:
                await new SetProximityMuffleEffectSettingsForm(this._aes).Show(player);
                break;
            case 6:
                await new SetMuffleEffectSettingsForm(this._aes).Show(player);
                break;
        }
    }
}