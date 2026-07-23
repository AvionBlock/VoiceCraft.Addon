import { Player } from "@minecraft/server";
import { DirectionalEffect } from "../../../API/Effects/DirectionalEffect";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class SetDirectionalEffectSettingsForm {
    private _aes;
    constructor(_aes: AudioEffectSystem);
    private _form;
    Show(player: Player, effect?: DirectionalEffect): Promise<void>;
    private Validate;
}
