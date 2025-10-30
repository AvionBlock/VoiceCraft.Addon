import { CommandPermissionLevel, CustomCommandOrigin, system } from "@minecraft/server"
/** @import {CustomCommandRegistry} from "@minecraft/server" */

export class CommandController {
    constructor() {
        system.beforeEvents.startup.subscribe(ev => {
            this.#RegisterCommands(ev.customCommandRegistry);
        });
    }

    /**
     * @param {CustomCommandRegistry} registry 
     */
    #RegisterCommands(registry) {
        registry.registerCommand({
            name: `${this._mainController.Namespace}:connect`,
            description: "Attempts a connection to the McWss server.",
            permissionLevel: CommandPermissionLevel.Admin
        }, (origin) => this.#ConnectCommand(origin))
    }

    /**
     * 
     * @param { CustomCommandOrigin } origin 
     * @returns { undefined }
     */
    #ConnectCommand(origin) {
        system.run(async () => {
            await this._mainController.StartStoryAsync();
        });
        return undefined;
    }
}