import { Player, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { Version } from "./API/Data/Version";
import { VoiceCraft } from "./API/VoiceCraft";
import { NetDataWriter } from "./API/Network/NetDataWriter";
import { NetDataReader } from "./API/Network/NetDataReader";
import { McApiPacket } from "./API/Network/Packets/McApiPacket";
import { Z85 } from "./API/Encoders/Z85";
import { CommandManager } from "./Managers/CommandManager";
import { McApiLoginPacket } from "./API/Network/Packets/McApiLoginPacket";
import { Guid } from "./API/Data/Guid";
import { McApiPacketType } from "./API/Data/Enums";
import { McApiAcceptPacket } from "./API/Network/Packets/McApiAcceptPacket";
import { Event } from "./API/Event";

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

  public OnPacket: Event<McApiPacket> = new Event<McApiPacket>();
  public OnAcceptPacket: Event<McApiAcceptPacket> = new Event<McApiAcceptPacket>();

  constructor() {
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      this.HandleScriptEvent(ev);
    })
  }

  public async ConnectAsync(source: Player, token: string) {
    this._requestIds.clear();
    this._source = source;
    const packet = new McApiLoginPacket(Guid.Create().toString(), token, this._version);
    if (this.RegisterRequestId(packet.RequestId)) {
      this.SendPacket(packet);
      const response = await this.GetResponseAsync(packet.RequestId, McApiAcceptPacket);
      console.log(JSON.stringify(response));
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

    console.log(`Packet Sent: ${this._tunnelId}${packetData}`);
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

  private async GetResponseAsync(requestId: string, type: typeof McApiPacket = McApiPacket, timeout: number = this._defaultTimeoutMs): Promise<McApiPacket> {
    let callbackData: McApiPacket | undefined = undefined;
    const callback = this.OnPacket.Subscribe((data) => {
      if ("RequestId" in data && typeof data.RequestId === "string" && data.RequestId === requestId && data instanceof type) {
        this.DeregisterRequestId(requestId);
        callbackData = data;
      }
    });

    try {
      const expiryTime = Date.now() + timeout;
      while (expiryTime > Date.now()) {
        if(callbackData !== undefined)
          return callbackData;
        await system.waitTicks(1);
      }

      throw new Error("Server response timeout!");
    }
    finally {
      this.DeregisterRequestId(requestId);
      this.OnPacket.Unsubscribe(callback);
    }
  }

  private async HandleScriptEvent(ev: ScriptEventCommandMessageAfterEvent) {
    const data = Z85.GetBytesWithPadding(ev.message);
    this._reader.SetBufferSource(data);
    const packetType = this._reader.GetByte() as McApiPacketType;
    await this.HandlePacketAsync(packetType, this._reader);
  }

  private async HandlePacketAsync(packetType: McApiPacketType, reader: NetDataReader) {
    switch (packetType) {
      case McApiPacketType.Accept:
        const acceptPacket = new McApiAcceptPacket();
        acceptPacket.Deserialize(reader);
        this.HandleAcceptPacket(acceptPacket);
        break;
    }
  }

  private HandleAcceptPacket(packet: McApiAcceptPacket) {
    this.OnPacket.Invoke(packet);
    this.OnAcceptPacket.Invoke(packet);
  }
}
