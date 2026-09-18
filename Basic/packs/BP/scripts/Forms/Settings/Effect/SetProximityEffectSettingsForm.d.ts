import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
import { ProximityEffect } from "../../../API/Effects/ProximityEffect";
export declare class SetProximityEffectSettingsForm {
    private _player;
    private _aes;
    private readonly _form;
    private readonly _effect;
    private readonly _bitmask;
    private readonly _minRange;
    private readonly _maxRange;
    private readonly _wetDry;
    constructor(_player: Player, _aes: AudioEffectSystem, editEffect?: ProximityEffect);
    ShowAsync(): Promise<void>;
    private Save;
    private GetData;
}
