import { TwoWayMap } from "../API/Data/TwoWayMap";
import { McApiSetEntityDescriptionRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
export class BindingManager {
    _vc;
    static IdTable = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
    ];
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
        this._bindedEntities.set(entityId, value.id);
        if (this._vc.Token === undefined)
            return true;
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(this._vc.Token, entityId, `Bound to player ${value.name}`));
        return true;
    }
    UnbindPlayer(playerId) {
        return this._bindedEntities.valueDelete(playerId);
    }
    GetEntityFromPlayerId(playerId) {
        return this._bindedEntities.valueGet(playerId);
    }
    OnNetworkEntityCreatedPacketEvent(ev) {
        let bindingKey = this.GenerateRandomId(5);
        while (this._unbindedEntities.valueHas(bindingKey)) {
            bindingKey = this.GenerateRandomId(5);
        }
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
    GenerateRandomId(length) {
        let id = '';
        for (let i = 0; i < length; i++) {
            id += BindingManager.IdTable[this.GetRandomInt(0, BindingManager.IdTable.length - 1)];
        }
        return id;
    }
}
