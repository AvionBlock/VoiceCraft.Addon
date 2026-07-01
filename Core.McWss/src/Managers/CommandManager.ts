import {
    CommandPermissionLevel,
    CustomCommandOrigin,
    CustomCommandParamType,
    CustomCommandRegistry, CustomCommandResult, CustomCommandStatus,
    Player,
    system,
} from "@minecraft/server";
import {McApiMcWss} from "../McApiMcWss";
import {Locales} from "../API/Locales";
import {VoiceCraft} from "../API/VoiceCraft";
import "../Extensions";
import {McApiConnectionState} from "../API/Data/Enums";
import {McApiLoginRequestPacket} from "../API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import {NetDataWriter} from "../API/Data/NetDataWriter";
import {NetDataReader} from "../API/Data/NetDataReader";
import {Z85} from "../API/Encoders/Z85";

export class CommandManager {
    constructor(private _mcApi: McApiMcWss) {
        system.beforeEvents.startup.subscribe((ev) => {
            this.RegisterCommands(ev.customCommandRegistry);
        });
    }

    private RegisterCommands(registry: CustomCommandRegistry) {
        registry.registerCommand(
            {
                name: `${VoiceCraft.Namespace}:vcconnect`,
                description: "Attempts a connection to the McWss server.",
                permissionLevel: CommandPermissionLevel.Host,
                mandatoryParameters: [
                    {name: "token", type: CustomCommandParamType.String},
                ],
            },
            (origin, token) => this.ConnectCommand(origin, token)
        );

        registry.registerCommand({
            name: `${VoiceCraft.Namespace}:vcconnect_raw`,
            description: "Attempts a connection to the McHttp server using raw IP and Port values. (Used for AutoConnect)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                {name: "ip", type: CustomCommandParamType.String},
                {name: "port", type: CustomCommandParamType.Integer},
                {name: "token", type: CustomCommandParamType.String},
            ],
        }, (origin, ip, port, token) => this.ConnectRawCommand(origin, ip, port, token))

        registry.registerCommand(
            {
                name: `${VoiceCraft.Namespace}:vctest`,
                description: "Test Command.",
                permissionLevel: CommandPermissionLevel.GameDirectors
            },
            (origin) => this.TestCommand(origin)
        )
    }

    private ConnectCommand(origin: CustomCommandOrigin, token: string) {
        if (
            origin.sourceEntity === undefined ||
            !(origin.sourceEntity instanceof Player)
        )
            throw new Error("Command origin must be of type player!");
        if (this._mcApi.ConnectionState !== McApiConnectionState.Disconnected)
            throw new Error("Already in a connected/connecting state!");

        system.run(async () => {
            const player = origin.sourceEntity as Player;

            try {
                player.translateMessage(Locales.VcMcApi.Status.Connecting);
                await this._mcApi.ConnectAsync("", 0, token);
                player.translateMessage(Locales.VcMcApi.Status.Connected);
            } catch (ex) {
                if (ex instanceof Error)
                    player.translateMessage(Locales.VcMcApi.Status.Disconnected, {
                        rawtext: [{translate: ex.message}],
                    });
            }
        });
        return undefined;
    }

    private ConnectRawCommand(_: CustomCommandOrigin, ip: string, port: number, token: string) {
        if (port < 1 || port > 65535)
            throw new Error("Invalid Port!");
        if (this._mcApi.ConnectionState !== McApiConnectionState.Disconnected) return undefined;
        system.run(async () => {
            await this._mcApi.ConnectAsync(ip, port, token);
        });
        return undefined;
    }

    private TestCommand(_: CustomCommandOrigin): CustomCommandResult | undefined {
        let packet = new McApiLoginRequestPacket("testAAA", "test2AAAA", VoiceCraft.Version, []);
        let writer = new NetDataWriter();
        let reader = new NetDataReader();

        packet.Serialize(writer);
        let encoded = writer.CopyData();
        let Z85Encoded = Z85.GetStringWithPadding(encoded);
        let Z85Decoded = Z85.GetBytesWithPadding(Z85Encoded);
        console.log(encoded);
        console.log(Z85Decoded);
        return {
            status: CustomCommandStatus.Success
        };
    }
}