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

export class CommandManager {
    constructor(private _mcapi: McApiMcHttp) {
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }

    private RegisterCommands(registry: CustomCommandRegistry) {
        registry.registerCommand(
            {
                name: `${VoiceCraft.Namespace}:vcconnect`,
                description: "Attempts a connection to the McWss server.",
                permissionLevel: CommandPermissionLevel.Admin,
                mandatoryParameters: [
                    {name: "hostname", type: CustomCommandParamType.String},
                    {name: "token", type: CustomCommandParamType.String},
                ],
            },
            (origin, hostname, token) => this.ConnectCommand(origin, hostname, token)
        );
    }

    private ConnectCommand(origin: CustomCommandOrigin, hostname: string, token: string) {
        if (
            origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player)
        )
            throw new Error("Command origin must be of type player!");
        system.run(async () => {
            const player = origin.sourceEntity as Player;
            try {
                player.translateMessage(Locales.VcMcApi.Status.Connecting);
                await this._mcapi.ConnectAsync(hostname, token);
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
}
