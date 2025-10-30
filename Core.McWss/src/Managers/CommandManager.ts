import { CommandPermissionLevel, CustomCommandError, CustomCommandOrigin, CustomCommandParamType, CustomCommandRegistry, CustomCommandStatus, Player, system } from "@minecraft/server"
import { McApiMcwss } from "../McApiMcwss";

export class CommandManager {
    private static readonly Namespace: string = "voicecraft_mcwss";

    constructor(private _mcapi: McApiMcwss) {
        system.beforeEvents.startup.subscribe(ev => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }

    private RegisterCommands(registry: CustomCommandRegistry) {
        registry.registerCommand({
            name: `${CommandManager.Namespace}:vcconnect`,
            description: "Attempts a connection to the McWss server.",
            permissionLevel: CommandPermissionLevel.Admin,
            mandatoryParameters: [
                { name: "token", type: CustomCommandParamType.String },
            ]
        }, (origin, token) => this.ConnectCommand(origin, token))
    }

    private ConnectCommand(origin: CustomCommandOrigin, token: string) {
        if (origin.sourceEntity === undefined || origin.sourceEntity.constructor !== Player)
            throw new Error("Command origin must be of type player!");
        system.run(async () => {
            const player = origin.sourceEntity as Player;
            try {
                player.sendMessage("§eConnecting...");
                await this._mcapi.ConnectAsync(token);
                player.sendMessage("§aConnection Successful!");
            }
            catch (ex) {
                player.sendMessage(`§cFailed to connect to server - ${ex}`)
            }
        });
        return undefined;
    }
}