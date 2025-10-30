import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandRegistry, system } from "@minecraft/server"

export class CommandController {
    private static readonly Namespace: string = "voicecraft";

    constructor() {
        system.beforeEvents.startup.subscribe(ev => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }

    private RegisterCommands(registry: CustomCommandRegistry) {
        registry.registerCommand({
            name: `${CommandController.Namespace}:connect`,
            description: "Attempts a connection to the McWss server.",
            permissionLevel: CommandPermissionLevel.Admin
        }, (origin) => this.ConnectCommand(origin))
    }

    private ConnectCommand(origin: CustomCommandOrigin) {
        system.run(async () => {

        });
        return undefined;
    }
}