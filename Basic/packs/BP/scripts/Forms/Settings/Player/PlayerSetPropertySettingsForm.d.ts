import { Player } from "@minecraft/server";
import { VoiceCraft } from "../../../API/VoiceCraft";
export declare class PlayerSetPropertySettingsForm {
    private _vc;
    constructor(_vc: VoiceCraft);
    private _form;
    Show(player: Player, entityId: number): Promise<void>;
    private Validate;
}
