import {
    CommandPermissionLevel,
    CustomCommandOrigin,
    CustomCommandParamType,
    CustomCommandRegistry,
    Player,
    system,
} from "@minecraft/server";
import {McApiMcWss} from "../McApiMcWss";
import {Locales} from "../API/Locales";
import {VoiceCraft} from "../API/VoiceCraft";
import "../Extensions";
import {McApiConnectionState} from "../API/Data/Enums";

export class CommandManager {
    constructor(private _mcApi: McApiMcWss) {
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }

    private RegisterCommands(registry: CustomCommandRegistry) {
        registry.registerCommand(
            {
                name: `${VoiceCraft.Namespace}:vcconnect`,
                description: "Attempts a connection to the McWss server.",
                permissionLevel: CommandPermissionLevel.Host,
                mandatoryParameters: [
                    {name: "token", type: CustomCommandParamType.String},
                ],
            },
            (origin, token) => this.ConnectCommand(origin, token)
        );
    }

    private ConnectCommand(origin: CustomCommandOrigin, token: string) {
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
                await this._mcApi.ConnectAsync("", 0, token);
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
