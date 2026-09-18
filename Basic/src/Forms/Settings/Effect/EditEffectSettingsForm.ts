import {Player, system} from "@minecraft/server";
import {CustomForm} from "@minecraft/server-ui";
import {AudioEffectSystem} from "../../../API/Systems/AudioEffectSystem";
import {IAudioEffect} from "../../../API/Interfaces/IAudioEffect";
import {EffectType} from "../../../API/Data/Enums";
import {SetVisibilityEffectSettingsForm} from "./SetVisibilityEffectSettingsForm";
import {SetProximityEffectSettingsForm} from "./SetProximityEffectSettingsForm";
import {SetDirectionalEffectSettingsForm} from "./SetDirectionalEffectSettingsForm";
import {SetProximityEchoEffectSettingsForm} from "./SetProximityEchoEffectSettingsForm";
import {SetEchoEffectSettingsForm} from "./SetEchoEffectSettingsForm";
import {SetProximityMuffleEffectSettingsForm} from "./SetProximityMuffleEffectSettingsForm";
import {SetMuffleEffectSettingsForm} from "./SetMuffleEffectSettingsForm";
import {DirectionalEffect} from "../../../API/Effects/DirectionalEffect";
import {VisibilityEffect} from "../../../API/Effects/VisibilityEffect";
import {ProximityEffect} from "../../../API/Effects/ProximityEffect";
import {ProximityEchoEffect} from "../../../API/Effects/ProximityEchoEffect";
import {EchoEffect} from "../../../API/Effects/EchoEffect";
import {ProximityMuffleEffect} from "../../../API/Effects/ProximityMuffleEffect";
import {MuffleEffect} from "../../../API/Effects/MuffleEffect";

export class EditEffectSettingsForm {
    private _form: CustomForm;

    constructor(private _player: Player, private _aes: AudioEffectSystem) {
        this._form = new CustomForm(this._player, "Edit Effect")
            .spacer();

        for (const effect of this._aes.Effects.entries()) {
            const selectedEffect = effect[1];
            selectedEffect.Bitmask = effect[0];
            this._form.button(`${selectedEffect.Bitmask}: ${EffectType[selectedEffect.EffectType]}`,
                () => this.ShowEditEffectSettings(selectedEffect));
        }
        this._form.closeButton();
    }

    public async ShowAsync() {
        try {
            await this._form.show();
        } catch (error) {
            if (this._player.isValid)
                this._player.sendMessage(`§c${error}`);
        }
    }

    public ShowEditEffectSettings(effect: IAudioEffect) {
        this._form.close();
        switch (effect.EffectType) {
            case EffectType.Visibility:
                system.run(async () =>
                    await new SetVisibilityEffectSettingsForm(this._player, this._aes, effect as VisibilityEffect)
                        .ShowAsync());
                break;
            case EffectType.Proximity:
                system.run(async () =>
                    await new SetProximityEffectSettingsForm(this._player, this._aes, effect as ProximityEffect)
                        .ShowAsync());
                break;
            case EffectType.Directional:
                system.run(async () =>
                    await new SetDirectionalEffectSettingsForm(this._player, this._aes, effect as DirectionalEffect)
                        .ShowAsync());
                break;
            case EffectType.ProximityEcho:
                system.run(async () =>
                    await new SetProximityEchoEffectSettingsForm(this._player, this._aes, effect as ProximityEchoEffect)
                        .ShowAsync());
                break;
            case EffectType.Echo:
                system.run(async () =>
                    await new SetEchoEffectSettingsForm(this._player, this._aes, effect as EchoEffect)
                        .ShowAsync());
                break;
            case EffectType.ProximityMuffle:
                system.run(async () =>
                    await new SetProximityMuffleEffectSettingsForm(this._player, this._aes, effect as ProximityMuffleEffect)
                        .ShowAsync());
                break;
            case EffectType.Muffle:
                system.run(async () =>
                    await new SetMuffleEffectSettingsForm(this._player, this._aes, effect as MuffleEffect)
                        .ShowAsync());
                break;
            case EffectType.None:
            default:
                break;
        }
    }
}