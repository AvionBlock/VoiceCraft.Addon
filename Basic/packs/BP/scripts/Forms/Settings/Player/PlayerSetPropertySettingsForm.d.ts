import { Player } from "@minecraft/server";
import { VoiceCraft } from "../../../API/VoiceCraft";
export declare class PlayerSetPropertySettingsForm {
    private _player;
    private _vc;
    private readonly _form;
    private _propertyType;
    private _property;
    private _value;
    constructor(_player: Player, _vc: VoiceCraft, entityId: number);
    ShowAsync(): Promise<void>;
    private Save;
    private GetData;
}
