import { VoiceCraft } from "../API/VoiceCraft";
import { BindingSystem } from "../API/Systems/BindingSystem";
import { AudioEffectSystem } from "../API/Systems/AudioEffectSystem";
export declare class CommandManager {
    private _vc;
    private _bs;
    private _aes;
    constructor(_vc: VoiceCraft, _bs: BindingSystem, _aes: AudioEffectSystem);
    private RegisterCommands;
    private BindCommand;
    private SettingsCommand;
}
