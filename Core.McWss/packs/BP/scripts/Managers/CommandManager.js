import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, Player, system, } from "@minecraft/server";
import { Z85 } from "../API/Encoders/Z85";
export class CommandManager {
    _mcapi;
    static Namespace = "voicecraft";
    constructor(_mcapi) {
        this._mcapi = _mcapi;
        system.beforeEvents.startup.subscribe((ev) => {
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
            ],
        }, (origin, token) => this.ConnectCommand(origin, token));
        registry.registerCommand({
            name: `${CommandManager.Namespace}:data_tunnel`,
            description: "Data transfer tunnel between servers",
            permissionLevel: CommandPermissionLevel.Host,
            optionalParameters: [
                { name: "data", type: CustomCommandParamType.String },
            ],
        }, (origin, data) => this.DataTunnelCommand(origin, data));
    }
    ConnectCommand(origin, token) {
        if (origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player))
            throw new Error("Command origin must be of type player!");
        system.run(async () => {
            const player = origin.sourceEntity;
            try {
                player.sendMessage("§eConnecting...");
                await this._mcapi.ConnectAsync(token);
                player.sendMessage("§aConnection Successful!");
            }
            catch (ex) {
                player.sendMessage(`§cFailed to connect to server - ${ex}`);
            }
        });
        return undefined;
    }
    DataTunnelCommand(origin, data) {
        try {
            let stringData = "";
            let first = true;
            while (this._mcapi.OutboundQueue.size > 0) {
                const packetData = this._mcapi.OutboundQueue.dequeue();
                if (packetData === undefined)
                    break;
                stringData = stringData.concat(`${!first ? "|" : ""}${Z85.GetStringWithPadding(packetData)}`);
                if (first) {
                    first = false;
                    continue;
                }
            }
            if (data !== undefined) {
                system.run(() => {
                    console.info(data);
                    const packets = data.split("|");
                    for (const packet of packets) {
                        const packetData = Z85.GetBytesWithPadding(packet);
                        if (packetData.length <= 0)
                            return;
                        this._mcapi.ReceivePacketAsync(packetData);
                    }
                });
            }
            return { status: CustomCommandStatus.Success, message: stringData };
        }
        catch {
            return { status: CustomCommandStatus.Failure };
        }
    }
}
