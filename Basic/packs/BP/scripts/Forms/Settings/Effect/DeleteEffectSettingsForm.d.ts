import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class DeleteEffectSettingsForm {
    private _aes;
    constructor(_aes: AudioEffectSystem);
    private _form;
    Show(player: Player): Promise<void>;
}
