import { VoiceCraft } from "../API/VoiceCraft";
import { FormManager } from "./FormManager";
import { BindingSystem } from "../API/Systems/BindingSystem";
export declare class CommandManager {
    private _vc;
    private _bs;
    private _fm;
    constructor(_vc: VoiceCraft, _bs: BindingSystem, _fm: FormManager);
    private RegisterCommands;
    private BindCommand;
    private SettingsCommand;
}
