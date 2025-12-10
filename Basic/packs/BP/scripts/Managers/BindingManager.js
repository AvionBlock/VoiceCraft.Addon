import { TwoWayMap } from "../API/Data/TwoWayMap";
import { McApiSetEntityDescriptionRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
export class BindingManager {
    _vc;
    _unbindedEntities = new TwoWayMap();
    _bindedEntities = new TwoWayMap();
    constructor(_vc) {
        this._vc = _vc;
        _vc.OnNetworkEntityCreatedPacket.Subscribe((ev) => this.OnNetworkEntityCreatedPacketEvent(ev));
        _vc.OnEntityDestroyedPacket.Subscribe((ev) => this.OnEntityDestroyedPacketEvent(ev));
        _vc.OnDisconnected.Subscribe((reason) => this.OnDisconnectedEvent(reason));
    }
    BindPlayer(bindingKey, value) {
        const entityId = this._unbindedEntities.valueGet(bindingKey);
        if (entityId === undefined)
            return false;
        this._unbindedEntities.delete(entityId);
        this._bindedEntities.set(entityId, value);
        return true;
    }
    UnbindPlayer(playerId) {
        return this._bindedEntities.valueDelete(playerId);
    }
    GetEntityFromPlayerId(playerId) {
        return this._bindedEntities.valueGet(playerId);
    }
    OnNetworkEntityCreatedPacketEvent(ev) {
        const bindingKey = this.GetRandomInt(0, 255).toString(); //Temporary.
        this._unbindedEntities.set(ev.Id, bindingKey);
        if (this._vc.Token === undefined)
            return;
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(this._vc.Token, ev.Id, `Welcome! Your binding key is ${bindingKey}`));
    }
    OnEntityDestroyedPacketEvent(ev) {
        this._unbindedEntities.delete(ev.Id);
        this._bindedEntities.delete(ev.Id);
    }
    OnDisconnectedEvent(reason) {
        this._unbindedEntities.clear();
        this._bindedEntities.clear();
    }
    GetRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
