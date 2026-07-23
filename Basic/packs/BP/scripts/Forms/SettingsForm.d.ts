import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../API/Systems/AudioEffectSystem";
import { VoiceCraft } from "../API/VoiceCraft";
import { BindingSystem } from "../API/Systems/BindingSystem";
export declare class SettingsForm {
    private _vc;
    private _bs;
    private _aes;
    constructor(_vc: VoiceCraft, _bs: BindingSystem, _aes: AudioEffectSystem);
    private _form;
    Show(player: Player): Promise<void>;
}
