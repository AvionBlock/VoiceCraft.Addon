import { VoiceCraft } from "../API/VoiceCraft";
import "../Extensions";
import { BindingManager } from "./BindingManager";
export declare class CommandManager {
    private _vc;
    private _bm;
    constructor(_vc: VoiceCraft, _bm: BindingManager);
    private RegisterCommands;
    private SetTitleCommand;
    private SetDescriptionCommand;
    private BindEntityCommand;
}
