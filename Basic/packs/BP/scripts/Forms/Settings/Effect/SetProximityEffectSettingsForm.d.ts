import { Player } from "@minecraft/server";
import { ProximityEffect } from "../../../API/Effects/ProximityEffect";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class SetProximityEffectSettingsForm {
    private _aes;
    constructor(_aes: AudioEffectSystem);
    private _form;
    Show(player: Player, effect?: ProximityEffect): Promise<void>;
    private Validate;
}
