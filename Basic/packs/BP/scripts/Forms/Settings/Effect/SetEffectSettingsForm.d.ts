import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
import { Player } from "@minecraft/server";
export declare class SetEffectSettingsForm {
    private _player;
    private _aes;
    private _form;
    constructor(_player: Player, _aes: AudioEffectSystem);
    ShowAsync(): Promise<void>;
    private ShowSetVisibilityEffectSettings;
    private ShowSetProximityEffectSettings;
    private ShowSetDirectionalEffectSettings;
    private ShowSetProximityEchoEffectSettings;
    private ShowSetEchoEffectSettings;
    private ShowSetProximityMuffleEffectSettings;
    private ShowSetMuffleEffectSettings;
}
