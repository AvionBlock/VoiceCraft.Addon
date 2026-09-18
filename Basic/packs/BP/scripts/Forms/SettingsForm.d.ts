import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../API/Systems/AudioEffectSystem";
import { VoiceCraft } from "../API/VoiceCraft";
import { BindingSystem } from "../API/Systems/BindingSystem";
export declare class SettingsForm {
    private _player;
    private _vc;
    private _bs;
    private _aes;
    private readonly _form;
    constructor(_player: Player, _vc: VoiceCraft, _bs: BindingSystem, _aes: AudioEffectSystem);
    ShowAsync(): Promise<void>;
    private ShowGeneralSettings;
    private ShowEffectSettings;
    private ShowPlayerSettings;
    private ShowAutoConnectSettings;
}
