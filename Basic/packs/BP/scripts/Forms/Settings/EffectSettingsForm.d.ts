import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../../API/Systems/AudioEffectSystem";
import { VoiceCraft } from "../../API/VoiceCraft";
export declare class EffectSettingsForm {
    private _player;
    private _vc;
    private _aes;
    private readonly _form;
    constructor(_player: Player, _vc: VoiceCraft, _aes: AudioEffectSystem);
    ShowAsync(): Promise<void>;
    private ShowSetEffectSettings;
    private ShowEditEffectSettings;
    private ShowDeleteEffectSettings;
    private ResetEffects;
}
