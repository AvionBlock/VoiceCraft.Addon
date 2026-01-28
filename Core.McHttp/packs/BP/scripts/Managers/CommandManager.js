import { CommandPermissionLevel, CustomCommandParamType, Player, system, } from "@minecraft/server";
import { Locales } from "../API/Locales";
import { VoiceCraft } from "../API/VoiceCraft";
import "../Extensions";
import { McApiConnectionState } from "../API/Data/Enums";
export class CommandManager {
    _mcapi;
    constructor(_mcapi) {
        this._mcapi = _mcapi;
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }
    RegisterCommands(registry) {
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vcconnect`,
            description: "Attempts a connection to the McWss server.",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { name: "hostname", type: CustomCommandParamType.String },
                { name: "token", type: CustomCommandParamType.String },
            ],
        }, (origin, hostname, token) => this.ConnectCommand(origin, hostname, token));
    }
    ConnectCommand(origin, hostname, token) {
        if (origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player))
            throw new Error("Command origin must be of type player!");
        if (this._mcapi.ConnectionState != McApiConnectionState.Disconnected)
            throw new Error("Already in a connected/connecting state!");
        system.run(async () => {
            const player = origin.sourceEntity;
            const connectedCallback = this._mcapi.OnConnected.Subscribe((_) => {
                player.translateMessage(Locales.VcMcApi.Status.Connected);
            });
            const disconnectedCallback = this._mcapi.OnDisconnected.Subscribe((reason) => {
                player.translateMessage(Locales.VcMcApi.Status.Disconnected, {
                    rawtext: [{ translate: reason }],
                });
            });
            try {
                player.translateMessage(Locales.VcMcApi.Status.Connecting);
                await this._mcapi.ConnectAsync(hostname, 0, token);
            }
            catch (ex) {
                if (ex instanceof Error)
                    player.translateMessage(Locales.VcMcApi.Status.Disconnected, {
                        rawtext: [{ translate: ex.message }],
                    });
            }
            finally {
                this._mcapi.OnConnected.Unsubscribe(connectedCallback);
                this._mcapi.OnDisconnected.Unsubscribe(disconnectedCallback);
            }
        });
        return undefined;
    }
}
