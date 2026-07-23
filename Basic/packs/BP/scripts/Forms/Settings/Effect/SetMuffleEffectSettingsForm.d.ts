import { Player } from "@minecraft/server";
import { MuffleEffect } from "../../../API/Effects/MuffleEffect";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class SetMuffleEffectSettingsForm {
    private _aes;
    constructor(_aes: AudioEffectSystem);
    private _form;
    Show(player: Player, effect?: MuffleEffect): Promise<void>;
    private Validate;
}
