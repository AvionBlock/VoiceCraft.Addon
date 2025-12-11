import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, Player, system, } from "@minecraft/server";
import { VoiceCraft } from "../API/VoiceCraft";
import { McApiSetEntityDescriptionRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import { McApiSetEntityTitleRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityTitleRequestPacket";
export class CommandManager {
    _vc;
    _bm;
    constructor(_vc, _bm) {
        this._vc = _vc;
        this._bm = _bm;
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }
    RegisterCommands(registry) {
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:set_title`,
            description: "Set's an entity's title",
            permissionLevel: CommandPermissionLevel.Host,
            mandatoryParameters: [
                { name: "id", type: CustomCommandParamType.Integer },
                { name: "value", type: CustomCommandParamType.String },
            ],
        }, (origin, id, value) => this.SetTitleCommand(origin, id, value));
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:set_description`,
            description: "Set's an entity's description",
            permissionLevel: CommandPermissionLevel.Host,
            mandatoryParameters: [
                { name: "id", type: CustomCommandParamType.Integer },
                { name: "value", type: CustomCommandParamType.String },
            ],
        }, (origin, id, value) => this.SetDescriptionCommand(origin, id, value));
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:bind`,
            description: "Binds to an entity",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [
                { name: "binding_key", type: CustomCommandParamType.String },
            ],
        }, (origin, bindingKey) => this.BindEntityCommand(origin, bindingKey));
        /*
        registry.registerCommand(
          {
            name: `${VoiceCraft.Namespace}:test`,
            description: "Test command",
            permissionLevel: CommandPermissionLevel.Any,
          },
          (origin) => this.TestCommand(origin)
        );
        */
    }
    SetTitleCommand(origin, id, value) {
        if (origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player))
            throw new Error("Command origin must be of type player!");
        system.run(async () => {
            if (this._vc.Token !== undefined) {
                this._vc.SendPacket(new McApiSetEntityTitleRequestPacket(this._vc.Token, id, value));
            }
        });
        return undefined;
    }
    SetDescriptionCommand(origin, id, value) {
        if (!(origin.sourceEntity instanceof Player))
            throw new Error("Command origin must be of type player!");
        system.run(async () => {
            if (this._vc.Token !== undefined) {
                this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(this._vc.Token, id, value));
            }
        });
        return undefined;
    }
    BindEntityCommand(origin, bindingKey) {
        if (!(origin.sourceEntity instanceof Player))
            throw new Error("Command origin must be of type player!");
        if (this._vc.ConnectionState !== 2)
            throw new Error("Not connected! Cannot bind!");
        if (!this._bm.BindPlayer(bindingKey, origin.sourceEntity.id))
            throw new Error("Could not bind! Binding key does not exist!");
        return {
            status: CustomCommandStatus.Success,
            message: "Successfully binded!",
        };
    }
}
