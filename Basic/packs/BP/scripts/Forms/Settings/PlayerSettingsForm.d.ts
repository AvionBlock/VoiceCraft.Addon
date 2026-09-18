import { Player } from "@minecraft/server";
import { VoiceCraft } from "../../API/VoiceCraft";
import { BindingSystem } from "../../API/Systems/BindingSystem";
export declare class PlayerSettingsForm {
    private _player;
    private _vc;
    private _bs;
    private readonly _form;
    private readonly _selectedPlayer;
    private readonly _controlsDisabled;
    constructor(_player: Player, _vc: VoiceCraft, _bs: BindingSystem);
    ShowAsync(): Promise<void>;
    private Kick;
    private SetMute;
    private SetDeafen;
    private ShowSetPropertiesSettings;
}
