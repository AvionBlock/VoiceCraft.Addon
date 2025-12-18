import { TwoWayMap } from "../API/Data/TwoWayMap";
import { McApiSetEntityDescriptionRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import { world } from "@minecraft/server";
import { McApiSetEntityWorldIdRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
import { McApiSetEntityNameRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEntityNameRequestPacket";
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
        world.afterEvents.playerLeave.subscribe((ev) => this.OnPlayerLeftEvent(ev));
        _vc.OnNetworkEntityCreatedPacket.Subscribe((ev) => this.OnNetworkEntityCreatedPacketEvent(ev));
        _vc.OnEntityDestroyedPacket.Subscribe((ev) => this.OnEntityDestroyedPacketEvent(ev));
        _vc.OnDisconnected.Subscribe((reason) => this.OnDisconnectedEvent(reason));
    }
    GetBindedPlayers() {
        return world.getAllPlayers().filter(x => this._bindedEntities.valueHas(x.id));
    }
    BindPlayer(bindingKey, player) {
        if (this._bindedEntities.valueHas(player.id))
            return false;
        const entityId = this._unbindedEntities.valueGet(bindingKey);
        if (entityId === undefined)
            return false;
        this._unbindedEntities.delete(entityId);
        this._bindedEntities.set(entityId, player.id);
        this._vc.SendPacket(new McApiSetEntityNameRequestPacket(entityId, player.name));
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(entityId, `Bound to player ${player.name}`));
        return true;
    }
    UnbindPlayer(playerId) {
        const entityId = this._bindedEntities.valueGet(playerId);
        if (entityId === undefined)
            return false;
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, ""));
        this._bindedEntities.valueDelete(playerId);
        let bindingKey = this.GenerateRandomId(5);
        while (this._unbindedEntities.valueHas(bindingKey)) {
            bindingKey = this.GenerateRandomId(5);
        }
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, ""));
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(entityId, `Welcome! Your binding key is ${bindingKey}`));
        this._unbindedEntities.set(entityId, bindingKey);
        return true;
    }
    GetEntityFromPlayerId(playerId) {
        return this._bindedEntities.valueGet(playerId);
    }
    OnPlayerLeftEvent(ev) {
        if (this._bindedEntities.valueHas(ev.playerId))
            this.UnbindPlayer(ev.playerId);
    }
    OnNetworkEntityCreatedPacketEvent(ev) {
        let bindingKey = this.GenerateRandomId(5);
        while (this._unbindedEntities.valueHas(bindingKey)) {
            bindingKey = this.GenerateRandomId(5);
        }
        this._unbindedEntities.set(ev.Id, bindingKey);
        console.log("Setting Binding Key");
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(ev.Id, ""));
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(ev.Id, `Welcome! Your binding key is ${bindingKey}`));
    }
    OnEntityDestroyedPacketEvent(ev) {
        this._unbindedEntities.delete(ev.Id);
        this._bindedEntities.delete(ev.Id);
    }
    OnDisconnectedEvent(_) {
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
