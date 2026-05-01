import { CommandPermissionLevel, CustomCommandParamType, Player, system, } from "@minecraft/server";
import { Locales } from "../API/Locales";
import { VoiceCraft } from "../API/VoiceCraft";
import "../Extensions";
import { McApiConnectionState } from "../API/Data/Enums";
export class CommandManager {
    _mcApi;
    constructor(_mcApi) {
        this._mcApi = _mcApi;
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }
    RegisterCommands(registry) {
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vcconnect`,
            description: "Attempts a connection to the McWss server.",
            permissionLevel: CommandPermissionLevel.Host,
            mandatoryParameters: [
                { name: "token", type: CustomCommandParamType.String },
            ],
        }, (origin, token) => this.ConnectCommand(origin, token));
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vcconnect_raw`,
            description: "Attempts a connection to the McHttp server using raw IP and Port values. (Used for AutoConnect)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { name: "ip", type: CustomCommandParamType.String },
                { name: "port", type: CustomCommandParamType.Integer },
                { name: "token", type: CustomCommandParamType.String },
            ],
        }, (origin, ip, port, token) => this.ConnectRawCommand(origin, ip, port, token));
    }
    ConnectCommand(origin, token) {
        if (origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player))
            throw new Error("Command origin must be of type player!");
        if (this._mcApi.ConnectionState !== McApiConnectionState.Disconnected)
            throw new Error("Already in a connected/connecting state!");
        system.run(async () => {
            const player = origin.sourceEntity;
            try {
                player.translateMessage(Locales.VcMcApi.Status.Connecting);
                await this._mcApi.ConnectAsync("", 0, token);
                player.translateMessage(Locales.VcMcApi.Status.Connected);
            }
            catch (ex) {
                if (ex instanceof Error)
                    player.translateMessage(Locales.VcMcApi.Status.Disconnected, {
                        rawtext: [{ translate: ex.message }],
                    });
            }
        });
        return undefined;
    }
    ConnectRawCommand(_, ip, port, token) {
        if (port < 1 || port > 65535)
            throw new Error("Invalid Port!");
        if (this._mcApi.ConnectionState !== McApiConnectionState.Disconnected)
            return undefined;
        system.run(async () => {
            await this._mcApi.ConnectAsync(ip, port, token);
        });
        return undefined;
    }
}
