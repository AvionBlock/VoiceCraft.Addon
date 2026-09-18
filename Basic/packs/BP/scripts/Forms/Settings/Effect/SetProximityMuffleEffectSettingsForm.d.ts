import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
import { ProximityMuffleEffect } from "../../../API/Effects/ProximityMuffleEffect";
export declare class SetProximityMuffleEffectSettingsForm {
    private _player;
    private _aes;
    private readonly _form;
    private readonly _effect;
    private readonly _bitmask;
    private readonly _factor;
    private readonly _wetDry;
    constructor(_player: Player, _aes: AudioEffectSystem, editEffect?: ProximityMuffleEffect);
    ShowAsync(): Promise<void>;
    private Save;
    private GetData;
}
