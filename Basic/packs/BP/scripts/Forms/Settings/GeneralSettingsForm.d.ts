import { Player } from "@minecraft/server";
export declare class GeneralSettingsForm {
    private _player;
    private readonly _form;
    private broadcastConnectedEvent;
    private broadcastDisconnectedEvent;
    private broadcastPlayerConnectedEvent;
    private broadcastPlayerDisconnectedEvent;
    private enableCaveEcho;
    private enableUnderwaterMuffle;
    private showVoiceIcons;
    constructor(_player: Player);
    ShowAsync(): Promise<void>;
}
