import { Player } from "@minecraft/server";
import { VisibilityEffect } from "../../../API/Effects/VisibilityEffect";
import { AudioEffectSystem } from "../../../API/Systems/AudioEffectSystem";
export declare class SetVisibilityEffectSettingsForm {
    private _player;
    private _aes;
    private readonly _form;
    private readonly _effect;
    private readonly _bitmask;
    constructor(_player: Player, _aes: AudioEffectSystem, editEffect?: VisibilityEffect);
    ShowAsync(): Promise<void>;
    private Save;
    private GetData;
}
