import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
export class CommandManager {
    _mcapi;
    static Namespace = "voicecraft_mcwss";
    constructor(_mcapi) {
        this._mcapi = _mcapi;
        system.beforeEvents.startup.subscribe(ev => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }
    RegisterCommands(registry) {
        registry.registerCommand({
            name: `${CommandManager.Namespace}:vcconnect`,
            description: "Attempts a connection to the McWss server.",
            permissionLevel: CommandPermissionLevel.Host,
            mandatoryParameters: [
                { name: "token", type: CustomCommandParamType.String },
            ]
        }, (origin, token) => this.ConnectCommand(origin, token));
    }
    ConnectCommand(origin, token) {
        if (origin.sourceEntity === undefined || origin.sourceEntity.constructor !== Player)
            throw new Error("Command origin must be of type player!");
        system.run(async () => {
            const player = origin.sourceEntity;
            try {
                player.sendMessage("§eConnecting...");
                await this._mcapi.ConnectAsync(player, token);
                player.sendMessage("§aConnection Successful!");
            }
            catch (ex) {
                player.sendMessage(`§cFailed to connect to server - ${ex}`);
            }
        });
        return undefined;
    }
}
