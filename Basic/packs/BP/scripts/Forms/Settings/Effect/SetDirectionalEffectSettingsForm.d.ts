import { Player } from "@minecraft/server";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
import { DirectionalEffect } from "../../../API/Effects/DirectionalEffect";
export declare class SetDirectionalEffectSettingsForm {
    private _player;
    private _aes;
    private readonly _form;
    private readonly _effect;
    private readonly _bitmask;
    private readonly _wetDry;
    constructor(_player: Player, _aes: AudioEffectSystem, editEffect?: DirectionalEffect);
    ShowAsync(): Promise<void>;
    private Save;
    private GetData;
}
