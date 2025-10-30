import { Player, system } from "@minecraft/server";
import { Version } from "./API/Data/Version";
import { VoiceCraft } from "./API/VoiceCraft";
import { NetDataWriter } from "./API/Network/NetDataWriter";
import { NetDataReader } from "./API/Network/NetDataReader";
import { McApiPacket } from "./API/Network/Packets/McApiPacket";
import { Z85 } from "./API/Encoders/Z85";
import { CommandManager } from "./Managers/CommandManager";
import { McApiLoginPacket } from "./API/Network/Packets/McApiLoginPacket";
import { Guid } from "./API/Data/Guid";

export class McApiMcwss {
  private _vc: VoiceCraft = new VoiceCraft();
  private _tunnelId: string = "vc:mcwss_api";
  private _version: Version = new Version(1, 1, 0);
  private _commands: CommandManager = new CommandManager(this);
  private _defaultTimeoutMs: number = 5000;
  //Connection state objects.
  private _source?: Player = undefined;
  private _token?: string = undefined;
  private _writer: NetDataWriter = new NetDataWriter();
  private _reader: NetDataReader = new NetDataReader();
  private _lastPing: number = 0;
  private _connecting: boolean = false;
  private _requestIds: Set<string> = new Set<string>();

  public async ConnectAsync(token: string) {
    this._requestIds.clear();
    const packet = new McApiLoginPacket(Guid.Create().toString(), token, this._version);
    if (this.RegisterRequestId(packet.RequestId)) {
      this.SendPacket(packet);
      await this.GetResponseAsync(packet.RequestId);
    }
  }

  private SendPacket(packet: McApiPacket) {
    this._writer.Reset();
    this._writer.PutByte(packet.PacketType);
    packet.Serialize(this._writer); //Serialize
    const packetData = Z85.GetStringWithPadding(
      this._writer.Data.slice(0, this._writer.Length)
    );
    if (packetData.length === 0) return;
    //this.#_source?.sendMessage({ rawtext: [{ text: `${VoiceCraft.#_rawtextPacketId}${packetData}`}] });
    this._source?.runCommand(
      `tellraw @s {"rawtext":[{"text":"${this._tunnelId}${packetData}"}]}`
    ); //We have to do it this way because of how the mc client handles chats from different sources.
  }

  private RegisterRequestId(requestId: string): boolean {
    if (this._requestIds.has(requestId))
      return false;
    this._requestIds.add(requestId);
    return true;
  }

  private DeregisterRequestId(requestId: string): boolean {
    return this._requestIds.delete(requestId);
  }

  private async GetResponseAsync(requestId: string, timeout: number = this._defaultTimeoutMs): Promise<McApiPacket> {
    try {
      const expiryTime = Date.now() + timeout;
      while (expiryTime > Date.now()) {
        await system.waitTicks(1);
      }

      throw new Error("Server response timeout!");
    }
    finally {
      this.DeregisterRequestId(requestId);
    }
  }
}
