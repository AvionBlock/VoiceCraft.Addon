import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
import { ProximityEchoEffect } from "../../../API/Effects/ProximityEchoEffect";
export declare class SetProximityEchoEffectSettingsForm {
    private _player;
    private _aes;
    private readonly _form;
    private readonly _effect;
    private readonly _bitmask;
    private readonly _delay;
    private readonly _range;
    private readonly _factor;
    private readonly _wetDry;
    constructor(_player: Player, _aes: AudioEffectSystem, editEffect?: ProximityEchoEffect);
    ShowAsync(): Promise<void>;
    private Save;
    private GetData;
}
