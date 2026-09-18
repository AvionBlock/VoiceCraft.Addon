import { Player } from "@minecraft/server";
export declare class AutoConnectSettingsForm {
    private _player;
    private readonly _form;
    private Ip;
    private Port;
    private LoginKey;
    private connectOnStartup;
    private autoReconnect;
    constructor(_player: Player);
    ShowAsync(): Promise<void>;
}
