import { Player } from "@minecraft/server";
import { VisibilityEffect } from "../../../API/Effects/VisibilityEffect";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class SetVisibilityEffectSettingsForm {
    private _aes;
    constructor(_aes: AudioEffectSystem);
    private _form;
    Show(player: Player, effect?: VisibilityEffect): Promise<void>;
    private Validate;
}
