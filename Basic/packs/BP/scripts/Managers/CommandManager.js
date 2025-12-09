import { CommandPermissionLevel, CustomCommandParamType, Player, system, } from "@minecraft/server";
import { VoiceCraft } from "../API/VoiceCraft";
import "../Extensions";
import { McApiSetEntityDescriptionRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import { McApiSetEntityTitleRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityTitleRequestPacket";
export class CommandManager {
    _vc;
    constructor(_vc) {
        this._vc = _vc;
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
        if (origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player))
            throw new Error("Command origin must be of type player!");
        system.run(async () => {
            if (this._vc.Token !== undefined) {
                this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(this._vc.Token, id, value));
            }
        });
        return undefined;
    }
}
