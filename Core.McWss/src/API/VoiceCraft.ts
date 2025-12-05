import { ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { Z85 } from "./Encoders/Z85";
import { McApiPacketType } from "./Data/Enums";
import { NetDataReader } from "./Network/NetDataReader";
import { McApiAcceptPacket } from "./Network/Packets/McApiAcceptPacket";
import { McApiDenyPacket } from "./Network/Packets/McApiDenyPacket";
import { McApiPingPacket } from "./Network/Packets/McApiPingPacket";
import { Event } from "./Event";
import { NetDataWriter } from "./Network/NetDataWriter";
import { McApiEntityCreatedPacket } from "./Network/Packets/McApiEntityCreatedPacket";
import { McApiNetworkEntityCreatedPacket } from "./Network/Packets/McApiNetworkEntityCreatedPacket";

export class VoiceCraft {
  public static readonly Namespace: string = "voicecraft";

  private _writer: NetDataWriter = new NetDataWriter();
  private _reader: NetDataReader = new NetDataReader();

  constructor() {
    system.afterEvents.scriptEventReceive.subscribe((ev) => this.HandleScriptEventAsync(ev));
  }

  //Events
  public readonly OnAcceptPacket: Event<McApiAcceptPacket> = new Event<McApiAcceptPacket>();
  public readonly OnDenyPacket: Event<McApiDenyPacket> = new Event<McApiDenyPacket>();
  public readonly OnPingPacket: Event<McApiPingPacket> = new Event<McApiPingPacket>();

  //McApi

  private async HandleScriptEventAsync(ev: ScriptEventCommandMessageAfterEvent) {
    switch (ev.id) {
      case `${VoiceCraft.Namespace}:onPacket`:
        await this.HandleOnPacketEventAsync(ev.message);
        break;
    }
  }

  private async HandleOnPacketEventAsync(packet: string) {
    const packetData = Z85.GetBytesWithPadding(packet);
    if (packetData.length <= 0) return;

    this._reader.SetBufferSource(packetData);
    const packetType = this._reader.GetByte();
    if (!(packetType in McApiPacketType)) return; //Not a valid packet.
    await this.HandlePacketAsync(packetType as McApiPacketType, this._reader);
  }

  private async HandlePacketAsync(packetType: McApiPacketType, reader: NetDataReader) {
    switch (packetType) {
      case McApiPacketType.Accept:
        const acceptPacket = new McApiAcceptPacket();
        acceptPacket.Deserialize(reader);
        this.HandleAcceptPacket(acceptPacket);
        break;
      case McApiPacketType.Deny:
        const denyPacket = new McApiDenyPacket();
        denyPacket.Deserialize(reader);
        this.HandleDenyPacket(denyPacket);
        break;
      case McApiPacketType.Ping:
        const pingPacket = new McApiPingPacket();
        pingPacket.Deserialize(reader);
        this.HandlePingPacket(pingPacket);
        break;
      case McApiPacketType.EntityCreated:
        const entityCreatedPacket = new McApiEntityCreatedPacket();
        entityCreatedPacket.Deserialize(reader);
        this.HandleEntityCreatedPacket(entityCreatedPacket);
        break;
      case McApiPacketType.NetworkEntityCreated:
        const networkEntityCreatedPacket = new McApiNetworkEntityCreatedPacket();
        networkEntityCreatedPacket.Deserialize(reader);
        this.HandleNetworkEntityCreatedPacket(networkEntityCreatedPacket);
        break;
    }
  }

  HandleAcceptPacket(packet: McApiAcceptPacket) {
    this.OnAcceptPacket.Invoke(packet);
  }

  HandleDenyPacket(packet: McApiDenyPacket) {
    this.OnDenyPacket.Invoke(packet);
  }

  HandlePingPacket(packet: McApiPingPacket) {
    this.OnPingPacket.Invoke(packet);
  }

  HandleEntityCreatedPacket(packet: McApiEntityCreatedPacket) {
    console.log(JSON.stringify(packet, (_, v) => typeof v === 'bigint' ? v.toString() : v));
  }

  HandleNetworkEntityCreatedPacket(packet: McApiNetworkEntityCreatedPacket) {
    console.log(JSON.stringify(packet, (_, v) => typeof v === 'bigint' ? v.toString() : v));
  }
}
