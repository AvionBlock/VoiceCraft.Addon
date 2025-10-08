import { system, ScriptEventCommandMessageAfterEvent, Entity } from "@minecraft/server";
import { InternalPacketType } from "./Data/Enums";
import { InternalConnectPacket } from "./Network/InternalPackets/InternalConnectPacket";
import { NetDataReader } from "./Network/NetDataReader";
import { NetDataWriter } from "./Network/NetDataWriter";
import { Z85 } from "./Encoders/Z85";
import { Event } from "./Event";
import { InternalPacket } from "./Network/InternalPackets/InternalPacket";
import { McApiPacket } from "./Network/Packets/McApiPacket";
import { InternalMcApiPacket } from "./Network/InternalPackets/InternalMcApiPacket";
import { InternalRequestIdAllocatedPacket } from "./Network/InternalPackets/InternalRequestIdAllocatedPacket copy";
import { InternalRequestIdUnallocatedPacket } from "./Network/InternalPackets/InternalRequestIdUnallocatedPacket";

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
  public OnInternalRequestIdAllocatedPacket?: Event<{
    Packet: InternalRequestIdAllocatedPacket;
    Entity?: Entity;
  }>;
  public OnInternalRequestIdUnallocatedPacket?: Event<{
    Packet: InternalRequestIdAllocatedPacket;
    Entity?: Entity;
  }>;
  public OnInternalConnectPacket?: Event<{
    Packet: InternalConnectPacket;
    Entity?: Entity;
  }>;
  //McApi
  public OnMcApiPacketReceived?: Event<McApiPacket>;

  private async AllocatedRequestId(requestId: string): Promise<boolean> {
    if (this._requests.add(requestId)) {
      await this.SendInternalPacketNoResponseAsync(new InternalRequestIdAllocatedPacket(requestId));
      return true;
    }
    return false;
  }

  private async UnallocateRequestId(requestId: string) {
    if (this._requests.delete(requestId))
      await this.SendInternalPacketNoResponseAsync(new InternalRequestIdUnallocatedPacket(requestId));
  }

  public async SendPacketAsync(
    requestId: string,
    packet: McApiPacket
  ): Promise<{ Packet?: InternalPacket; Entity?: Entity }> {
    const internalPacket = new InternalMcApiPacket(requestId, packet);
    const result = await this.SendInternalPacketAsync(internalPacket);
    return result;
  }

  private async SendInternalPacketAsync(packet: InternalPacket): Promise<{ Packet?: InternalPacket; Entity?: Entity }> {
    if (packet.RequestId !== undefined && this._requests.has(packet.RequestId))
      throw new Error(`A request with the id ${packet.RequestId} already exists!`);

    this._writer.Reset();
    this._writer.PutShort(packet.PacketType);
    packet.Serialize(this._writer);
    const data = Z85.GetStringWithPadding(this._writer.Data.slice(0, this._writer.Length));

    if (packet.RequestId !== undefined && await this.AllocatedRequestId(packet.RequestId)) {
      system.sendScriptEvent("vc:internal_api", data);
      const result = await this.GetInternalPacketResultAsync(packet.RequestId);
      this.UnallocateRequestId(packet.RequestId);
      return result;
    }

    system.sendScriptEvent("vc:internal_api", data);
    return { Packet: undefined, Entity: undefined };
  }

  private async SendInternalPacketNoResponseAsync(packet: InternalPacket) {
    this._writer.Reset();
    this._writer.PutShort(packet.PacketType);
    packet.Serialize(this._writer);
    const data = Z85.GetStringWithPadding(this._writer.Data.slice(0, this._writer.Length));

    system.sendScriptEvent("vc:internal_api", data);
  }

  private async GetInternalPacketResultAsync(requestId: string): Promise<{ Packet: InternalPacket; Entity?: Entity }> {
    let result: { Packet: InternalPacket; Entity?: Entity } | undefined = undefined;
    const callback = (ev: { Packet: InternalPacket; Entity?: Entity }) => {
      if (ev.Packet.RequestId === requestId) result = ev;
    };

    this.OnInternalPacketReceived?.Subscribe(callback);
    while (result === undefined) {
      await system.waitTicks(1);
    }
    this.OnInternalPacketReceived?.Unsubscribe(callback);
    return result;
  }

  private HandleScriptEvent(ev: ScriptEventCommandMessageAfterEvent) {
    if (ev.id !== "vc:internal_api") return;

    const data = Z85.GetBytesWithPadding(ev.message);
    this._reader.SetBufferSource(data);
    const id = this._reader.GetShort();

    switch (id) {
      case InternalPacketType.RequestIdAllocated:
        const requestIdAllocatedPacket = new InternalRequestIdAllocatedPacket();
        requestIdAllocatedPacket.Deserialize(this._reader);
        this.HandleInternalRequestIdAllocatedPacket(requestIdAllocatedPacket, ev.initiator ?? ev.sourceEntity);
        break;
      case InternalPacketType.RequestIdUnallocated:
        const requestIdUnallocatedPacket = new InternalRequestIdUnallocatedPacket();
        requestIdUnallocatedPacket.Deserialize(this._reader);
        this.HandleInternalRequestIdUnallocatedPacket(requestIdUnallocatedPacket, ev.initiator ?? ev.sourceEntity);
        break;
      case InternalPacketType.Connect:
        const connectPacket = new InternalConnectPacket();
        connectPacket.Deserialize(this._reader);
        this.HandleInternalConnectPacket(connectPacket, ev.initiator ?? ev.sourceEntity);
        break;
    }
  }

  private HandleInternalRequestIdAllocatedPacket(packet: InternalRequestIdAllocatedPacket, entity?: Entity) {
    this.OnInternalPacketReceived?.Invoke({ Packet: packet, Entity: entity });
    this.OnInternalRequestIdAllocatedPacket?.Invoke({ Packet: packet, Entity: entity });
  }

  private HandleInternalRequestIdUnallocatedPacket(packet: InternalRequestIdUnallocatedPacket, entity?: Entity) {
    this.OnInternalPacketReceived?.Invoke({ Packet: packet, Entity: entity });
    this.OnInternalRequestIdUnallocatedPacket?.Invoke({ Packet: packet, Entity: entity });
  }

  private HandleInternalConnectPacket(packet: InternalConnectPacket, entity?: Entity) {
    this.OnInternalPacketReceived?.Invoke({ Packet: packet, Entity: entity });
    this.OnInternalConnectPacket?.Invoke({ Packet: packet, Entity: entity });
  }
}
