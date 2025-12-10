import { VoiceCraft } from "../API/VoiceCraft";
import { TwoWayMap } from "../API/Data/TwoWayMap";
import { McApiOnNetworkEntityCreatedPacket } from "../API/Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import { McApiSetEntityDescriptionRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import { McApiOnEntityDestroyedPacket } from "../API/Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";

export class BindingManager {
  private readonly _unbindedEntities: TwoWayMap<number, string> = new TwoWayMap<
    number,
    string
  >();
  private readonly _bindedEntities: TwoWayMap<number, string> = new TwoWayMap<
    number,
    string
  >();

  constructor(private _vc: VoiceCraft) {
    _vc.OnNetworkEntityCreatedPacket.Subscribe(
      (ev: McApiOnNetworkEntityCreatedPacket) =>
        this.OnNetworkEntityCreatedPacketEvent(ev)
    );

    _vc.OnEntityDestroyedPacket.Subscribe((ev: McApiOnEntityDestroyedPacket) =>
      this.OnEntityDestroyedPacketEvent(ev)
    );
  }

  public BindEntity(bindingKey: string, value: string): boolean {
    const entityId = this._unbindedEntities.valueGet(bindingKey);
    if(entityId === undefined) return false;
    this._unbindedEntities.delete(entityId);
    this._bindedEntities.set(entityId, value);
    return true;
  }

  private OnNetworkEntityCreatedPacketEvent(
    ev: McApiOnNetworkEntityCreatedPacket
  ) {
    const bindingKey = this.GetRandomInt(0, 255).toString(); //Temporary.
    this._unbindedEntities.set(ev.Id, bindingKey);
    if (this._vc.Token === undefined) return;
    this._vc.SendPacket(
      new McApiSetEntityDescriptionRequestPacket(
        this._vc.Token,
        ev.Id,
        `Welcome! Your binding key is ${bindingKey}`
      )
    );
  }

  private OnEntityDestroyedPacketEvent(ev: McApiOnEntityDestroyedPacket) {
    this._unbindedEntities.delete(ev.Id);
    this._bindedEntities.delete(ev.Id);
  }

  private GetRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
