import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
import { EchoEffect } from "../../../API/Effects/EchoEffect";
export declare class SetEchoEffectSettingsForm {
    private _player;
    private _aes;
    private readonly _form;
    private readonly _effect;
    private readonly _bitmask;
    private readonly _delay;
    private readonly _feedback;
    private readonly _wetDry;
    constructor(_player: Player, _aes: AudioEffectSystem, editEffect?: EchoEffect);
    ShowAsync(): Promise<void>;
    private Save;
    private GetData;
}
