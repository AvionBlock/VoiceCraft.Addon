import {
  system,
  ScriptEventCommandMessageAfterEvent,
  Entity,
} from "@minecraft/server";
import { InternalPacketType } from "./Data/Enums";
import { InternalConnectPacket } from "./Network/InternalPackets/InternalConnectPacket";
import { NetDataReader } from "./Network/NetDataReader";
import { NetDataWriter } from "./Network/NetDataWriter";
import { Z85 } from "./Encoders/Z85";
import { Event } from "./Event";
import { InternalPacket } from "./Network/InternalPackets/InternalPacket";
import { McApiPacket } from "./Network/Packets/McApiPacket";
import { InternalMcApiPacket } from "./Network/InternalPackets/InternalMcApiPacket";

export class VoiceCraft {
  constructor() {
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      this.HandleScriptEvent(ev);
    });
  }

  private _writer = new NetDataWriter();
  private _reader = new NetDataReader();
  private _requests = new Set<string>();

  //Events
  //Internal
  public OnInternalPacketReceived?: Event<{
    Packet: InternalPacket;
    Entity?: Entity;
  }>;
  public OnInternalConnectPacket?: Event<{
    Packet: InternalConnectPacket;
    Entity?: Entity;
  }>;
  //McApi
  public OnMcApiPacketReceived?: Event<McApiPacket>;

  public async SendPacketAsync(
    requestId: string,
    packet: McApiPacket
  ): Promise<{ Packet: InternalPacket; Entity?: Entity }> {
    const internalPacket = new InternalMcApiPacket(requestId, packet);
    const result = await this.SendInternalPacketAsync(internalPacket);
    return result;
  }

  public async SendInternalPacketAsync(
    packet: InternalPacket
  ): Promise<{ Packet: InternalPacket; Entity?: Entity }> {
    if (this._requests.has(packet.RequestId))
      throw new Error(
        `A request with the id ${packet.RequestId} already exists!`
      );

    this._requests.add(packet.RequestId);
    this._writer.Reset();
    packet.Serialize(this._writer);
    const data = Z85.GetStringWithPadding(
      this._writer.Data.slice(0, this._writer.Length)
    );
    system.sendScriptEvent(`vc:${packet.PacketType}`, data);
    return this.GetInternalPacketResultAsync(packet.RequestId);
  }

  private async GetInternalPacketResultAsync(
    requestId: string
  ): Promise<{ Packet: InternalPacket; Entity?: Entity }> {
    let result: { Packet: InternalPacket; Entity?: Entity } | undefined =
      undefined;
    const callback = (ev: { Packet: InternalPacket; Entity?: Entity }) => {
      if (ev.Packet.RequestId === requestId) result = ev;
    };

    this.OnInternalPacketReceived?.Subscribe(callback);
    while (result === undefined) {
      await system.waitTicks(1);
    }
    this.OnInternalPacketReceived?.Unsubscribe(callback);
    this._requests.delete(requestId);
    return result;
  }

  private HandleScriptEvent(ev: ScriptEventCommandMessageAfterEvent) {
    if (!ev.id.startsWith("vc:")) return;

    const data = Z85.GetBytesWithPadding(ev.message);
    this._reader.SetBufferSource(data);

    switch (ev.id) {
      case `vc:${InternalPacketType.Connect}`:
        const connectPacket = new InternalConnectPacket("");
        connectPacket.Deserialize(this._reader);
        this.HandleInternalConnectPacket(
          connectPacket,
          ev.initiator ?? ev.sourceEntity
        );
        break;
    }
  }

  private HandleInternalConnectPacket(
    packet: InternalConnectPacket,
    entity?: Entity
  ) {
    this.OnInternalConnectPacket?.Invoke({ Packet: packet, Entity: entity });
  }
}
