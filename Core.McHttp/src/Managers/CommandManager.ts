import {
    CommandPermissionLevel,
    CustomCommandOrigin,
    CustomCommandParamType,
    CustomCommandRegistry,
    Player,
    system,
} from "@minecraft/server";
import {McApiMcHttp} from "../McApiMcHttp";
import {Locales} from "../API/Locales";
import {VoiceCraft} from "../API/VoiceCraft";
import "../Extensions";
import {McApiConnectionState} from "../API/Data/Enums";

export class CommandManager {
    constructor(private _mcApi: McApiMcHttp) {
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }

    private RegisterCommands(registry: CustomCommandRegistry) {
        registry.registerCommand(
            {
                name: `${VoiceCraft.Namespace}:vcconnect`,
                description: "Attempts a connection to the McHttp server.",
                permissionLevel: CommandPermissionLevel.GameDirectors,
                mandatoryParameters: [
                    {name: "hostname", type: CustomCommandParamType.String},
                    {name: "token", type: CustomCommandParamType.String},
                ],
            },
            (origin, hostname, token) => this.ConnectCommand(origin, hostname, token)
        );

        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vcconnect_raw`,
            description: "Attempts a connection to the McHttp server using raw IP and Port values. (Used for AutoConnect)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {name: "ip", type: CustomCommandParamType.String},
                {name: "port", type: CustomCommandParamType.Integer},
                {name: "token", type: CustomCommandParamType.String},
            ],
        }, (origin, ip, port, token) => this.ConnectRawCommand(origin, ip, port, token))
    }

    private ConnectCommand(origin: CustomCommandOrigin, hostname: string, token: string) {
        if (
            origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player)
        )
            throw new Error("Command origin must be of type player!");
        if (this._mcApi.ConnectionState !== McApiConnectionState.Disconnected)
            throw new Error("Already in a connected/connecting state!");

        system.run(async () => {
            const player = origin.sourceEntity as Player;

            try {
                player.translateMessage(Locales.VcMcApi.Status.Connecting);
                await this._mcApi.ConnectAsync(hostname, 0, token);
                player.translateMessage(Locales.VcMcApi.Status.Connected);
            } catch (ex) {
                if (ex instanceof Error)
                    player.translateMessage(Locales.VcMcApi.Status.Disconnected, {
                        rawtext: [{translate: ex.message}],
                    });
            }
        });
        return undefined;
    }

    private ConnectRawCommand(_: CustomCommandOrigin, ip: string, port: number, token: string) {
        if (port < 1 || port > 65535)
            throw new Error("Invalid Port!");
        if (this._mcApi.ConnectionState !== McApiConnectionState.Disconnected) return undefined;
        system.run(async () => {
            await this._mcApi.ConnectAsync(`http://${ip}:${port}`, 0, token);
        });
        return undefined;
    }
}
