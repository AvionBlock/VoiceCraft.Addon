import { Player } from "@minecraft/server";
import { VoiceCraft } from "../../API/VoiceCraft";
import { BindingSystem } from "../../API/Systems/BindingSystem";
export declare class PlayerSettingsForm {
    private _vc;
    private _bs;
    constructor(_vc: VoiceCraft, _bs: BindingSystem);
    private _form;
    Show(player: Player): Promise<void>;
}
