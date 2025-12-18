import {
    CommandPermissionLevel,
    CustomCommandOrigin,
    CustomCommandParamType,
    CustomCommandRegistry,
    CustomCommandResult,
    CustomCommandStatus,
    Player,
    system,
} from "@minecraft/server";
import {VoiceCraft} from "../API/VoiceCraft";
import {BindingManager} from "./BindingManager";
import {FormManager} from "./FormManager";

export class CommandManager {
    constructor(private _vc: VoiceCraft, private _bm: BindingManager, private _fm: FormManager) {
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }

    private RegisterCommands(registry: CustomCommandRegistry) {
        registry.registerCommand(
            {
                name: `${VoiceCraft.Namespace}:vcbind`,
                description: "Binds to an entity",
                permissionLevel: CommandPermissionLevel.Any,
                mandatoryParameters: [
                    {name: "binding_key", type: CustomCommandParamType.String},
                ],
            },
            (origin, bindingKey) => this.BindCommand(origin, bindingKey)
        );

        registry.registerCommand(
            {
                name: `${VoiceCraft.Namespace}:vcsettings`,
                description: "Shows voicecraft settings.",
                permissionLevel: CommandPermissionLevel.GameDirectors
            },
            (origin) => this.SettingsCommand(origin)
        )
    }

    private BindCommand(
        origin: CustomCommandOrigin,
        bindingKey: string
    ): CustomCommandResult {
        if (!(origin.sourceEntity instanceof Player))
            return {
                status: CustomCommandStatus.Failure,
                message: "Command origin must be of type player!"
            };

        if (this._vc.ConnectionState !== 2)
            return {
                status: CustomCommandStatus.Failure,
                message: "Not connected! Cannot bind!"
            };
        if (!this._bm.BindPlayer(bindingKey, origin.sourceEntity))
            return {
                status: CustomCommandStatus.Failure,
                message: "Could not bind! Binding key does not exist or already bound!"
            };
        return {
            status: CustomCommandStatus.Success,
            message: "Successfully binded!",
        };
    }

    private SettingsCommand(origin: CustomCommandOrigin): CustomCommandResult | undefined {
        if (!(origin.sourceEntity instanceof Player))
            return {
                status: CustomCommandStatus.Failure,
                message: "Command origin must be of type player!"
            };
        const player = origin.sourceEntity;

        system.run(async () => {
            await this._fm.ShowMainMenuSettingsFormAsync(player);
        })
        return undefined;
    }
}
