import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, Player, system, } from "@minecraft/server";
import { Z85 } from "../API/Encoders/Z85";
import { Locales } from "../API/Locales";
import { VoiceCraft } from "../API/VoiceCraft";
import "../Extensions";
export class CommandManager {
    _mcapi;
    constructor(_mcapi) {
        this._mcapi = _mcapi;
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }
    RegisterCommands(registry) {
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vcconnect`,
            description: "Attempts a connection to the McWss server.",
            permissionLevel: CommandPermissionLevel.Host,
            mandatoryParameters: [
                { name: "token", type: CustomCommandParamType.String },
            ],
        }, (origin, token) => this.ConnectCommand(origin, token));
        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:data_tunnel`,
            description: "Data transfer tunnel between servers",
            permissionLevel: CommandPermissionLevel.Host,
            optionalParameters: [
                { name: "data", type: CustomCommandParamType.String },
            ],
        }, (origin, data) => this.SendCommandTunnel(origin, data));
    }
    ConnectCommand(origin, token) {
        if (origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player))
            throw new Error("Command origin must be of type player!");
        system.run(async () => {
            const player = origin.sourceEntity;
            try {
                player.translateMessage(Locales.VcMcApi.Status.Connecting);
                await this._mcapi.ConnectAsync(token);
                player.translateMessage(Locales.VcMcApi.Status.Connected);
            }
            catch (ex) {
                if (ex instanceof Error)
                    player.translateMessage(Locales.VcMcApi.Status.Disconnected, {
                        rawtext: [{ translate: ex.message }],
                    });
            }
        });
        return undefined;
    }
    SendCommandTunnel(_, data) {
        if (data.length > 0) {
            system.run(async () => {
                let packets = data.split("|");
                for (const packet of packets) {
                    await this._mcapi.ReceivePacketAsync(packet);
                }
            });
        }
        let packetData = this._mcapi.OutboundQueue.dequeue();
        if (packetData === undefined)
            return {
                status: CustomCommandStatus.Success,
                message: ""
            };
        let stringData = Z85.GetStringWithPadding(packetData);
        while (stringData.length < 1000) {
            packetData = this._mcapi.OutboundQueue.dequeue();
            if (packetData === undefined)
                break;
            stringData += `|${Z85.GetStringWithPadding(packetData)}`;
        }
        stringData = stringData.replaceAll("%", "%%");
        return {
            status: CustomCommandStatus.Success,
            message: stringData,
        };
    }
}
