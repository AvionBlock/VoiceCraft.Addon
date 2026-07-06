import { Player } from "@minecraft/server";
import { ProximityMuffleEffect } from "../../../API/Effects/ProximityMuffleEffect";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class SetProximityMuffleEffectSettingsForm {
    private _aes;
    constructor(_aes: AudioEffectSystem);
    private _form;
    Show(player: Player, effect?: ProximityMuffleEffect): Promise<void>;
    private Validate;
}
