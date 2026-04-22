import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, Player, system, } from "@minecraft/server";
import { VoiceCraft } from "../API/VoiceCraft";
import { UTF8 } from "../API/Encoders/UTF8";
export class CommandManager {
    _vc;
    _bs;
    _fm;
    constructor(_vc, _bs, _fm) {
        this._vc = _vc;
        this._bs = _bs;
        this._fm = _fm;
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }
    RegisterCommands(registry) {
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vcbind`,
            description: "Binds to an entity",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [
                { name: "binding_key", type: CustomCommandParamType.String },
            ],
        }, (origin, bindingKey) => this.BindCommand(origin, bindingKey));
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vcsettings`,
            description: "Shows voicecraft settings.",
            permissionLevel: CommandPermissionLevel.GameDirectors
        }, (origin) => this.SettingsCommand(origin));
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vctest`,
            description: "Test Command.",
            permissionLevel: CommandPermissionLevel.GameDirectors
        }, (origin) => this.TestCommand(origin));
    }
    BindCommand(origin, bindingKey) {
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
        if (!this._bs.BindPlayer(bindingKey, origin.sourceEntity))
            return {
                status: CustomCommandStatus.Failure,
                message: "Could not bind! Binding key does not exist or already bound!"
            };
        return {
            status: CustomCommandStatus.Success,
            message: "Successfully binded!",
        };
    }
    SettingsCommand(origin) {
        if (!(origin.sourceEntity instanceof Player))
            return {
                status: CustomCommandStatus.Failure,
                message: "Command origin must be of type player!"
            };
        const player = origin.sourceEntity;
        system.run(async () => {
            await this._fm.ShowMainMenuSettingsFormAsync(player);
        });
        return undefined;
    }
    TestCommand(_) {
        let encoded = UTF8.GetBytes("Testing 123");
        if (encoded === undefined)
            return undefined;
        let decoded = UTF8.GetString(encoded, 0, encoded.length);
        return {
            status: CustomCommandStatus.Success,
            message: decoded
        };
    }
}
