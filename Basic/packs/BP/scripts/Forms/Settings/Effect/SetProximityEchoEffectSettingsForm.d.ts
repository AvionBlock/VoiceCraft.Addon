import { Player } from "@minecraft/server";
import { ProximityEchoEffect } from "../../../API/Effects/ProximityEchoEffect";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class SetProximityEchoEffectSettingsForm {
    private _aes;
    constructor(_aes: AudioEffectSystem);
    private _form;
    Show(player: Player, effect?: ProximityEchoEffect): Promise<void>;
    private Validate;
}
