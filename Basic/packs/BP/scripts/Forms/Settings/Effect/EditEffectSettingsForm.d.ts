import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
import { IAudioEffect } from "../../../API/Interfaces/IAudioEffect";
export declare class EditEffectSettingsForm {
    private _player;
    private _aes;
    private _form;
    constructor(_player: Player, _aes: AudioEffectSystem);
    ShowAsync(): Promise<void>;
    ShowEditEffectSettings(effect: IAudioEffect): void;
}
