import { VoiceCraft } from "../API/VoiceCraft";
import { BindingManager } from "./BindingManager";
import { FormManager } from "./FormManager";
export declare class CommandManager {
    private _vc;
    private _bm;
    private _fm;
    constructor(_vc: VoiceCraft, _bm: BindingManager, _fm: FormManager);
    private RegisterCommands;
    private BindCommand;
    private SettingsCommand;
}
