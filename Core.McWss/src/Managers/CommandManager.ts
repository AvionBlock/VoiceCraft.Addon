import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandParamType, CustomCommandRegistry, system } from "@minecraft/server"
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
        system.run(async () => {
            this._mcapi.ConnectAsync(token);
        });
        return undefined;
    }
}