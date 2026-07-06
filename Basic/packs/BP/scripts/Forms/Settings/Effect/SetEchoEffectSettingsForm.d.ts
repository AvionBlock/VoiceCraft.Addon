import { Player } from "@minecraft/server";
import { EchoEffect } from "../../../API/Effects/EchoEffect";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class SetEchoEffectSettingsForm {
    private _aes;
    constructor(_aes: AudioEffectSystem);
    private _form;
    Show(player: Player, effect?: EchoEffect): Promise<void>;
    private Validate;
}
