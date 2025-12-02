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
import { McApiMcwss } from "../McApiMcwss";
import { Z85 } from "../API/Encoders/Z85";
import { Locales } from "../API/Locales";
import "../Extensions";

export class CommandManager {
  private static readonly Namespace: string = "voicecraft";

  constructor(private _mcapi: McApiMcwss) {
    system.beforeEvents.startup.subscribe((ev) => {
      this.RegisterCommands(ev.customCommandRegistry);
    });
  }

  private RegisterCommands(registry: CustomCommandRegistry) {
    registry.registerCommand(
      {
        name: `${CommandManager.Namespace}:vcconnect`,
        description: "Attempts a connection to the McWss server.",
        permissionLevel: CommandPermissionLevel.Host,
        mandatoryParameters: [
          { name: "token", type: CustomCommandParamType.String },
        ],
      },
      (origin, token) => this.ConnectCommand(origin, token)
    );

    registry.registerCommand(
      {
        name: `${CommandManager.Namespace}:data_tunnel`,
        description: "Data transfer tunnel between servers",
        permissionLevel: CommandPermissionLevel.Host,
        optionalParameters: [
          { name: "data", type: CustomCommandParamType.String },
        ],
      },
      (origin, data) => this.DataTunnelCommand(origin, data)
    );
  }

  private ConnectCommand(origin: CustomCommandOrigin, token: string) {
    if (
      origin.sourceEntity === undefined ||
      !(origin.sourceEntity instanceof Player)
    )
      throw new Error("Command origin must be of type player!");
    system.run(async () => {
      const player = origin.sourceEntity as Player;
      try {
        player.translateMessage(Locales.VcMcApi.Status.Connecting);
        await this._mcapi.ConnectAsync(token);
        player.translateMessage(Locales.VcMcApi.Status.Connected);
      } catch (ex) {
        if (ex instanceof Error)
          player.translateMessage(Locales.VcMcApi.Status.DisconnectError, {
            rawtext: [{ translate: ex.message }],
          });
      }
    });
    return undefined;
  }

  private DataTunnelCommand(
    origin: CustomCommandOrigin,
    data: string
  ): CustomCommandResult | undefined {
    try {
      let stringData = "";
      let first = true;
      while (this._mcapi.OutboundQueue.size > 0) {
        const packetData = this._mcapi.OutboundQueue.dequeue();
        if (packetData === undefined) break;
        stringData = stringData.concat(
          `${!first ? "|" : ""}${Z85.GetStringWithPadding(packetData)}`
        );
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
            if (packetData.length <= 0) return;
            this._mcapi.ReceivePacketAsync(packetData);
          }
        });
      }
      return { status: CustomCommandStatus.Success, message: stringData };
    } catch {
      return { status: CustomCommandStatus.Failure };
    }
  }
}
