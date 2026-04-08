import { VoiceCraft } from "../VoiceCraft";
import { system, world } from "@minecraft/server";
import { TwoWayMap } from "../Data/TwoWayMap";
import { McApiSetEntityNameRequestPacket } from "../Network/McApiPackets/Request/McApiSetEntityNameRequestPacket";
import { McApiSetEntityDescriptionRequestPacket } from "../Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import { McApiSetEntityWorldIdRequestPacket } from "../Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
export class BindingSystem {
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
    get UnboundEntities() {
        return this._unboundEntities;
    }
    get BoundEntities() {
        return this._boundEntities;
    }
    get BoundPlayers() {
        return world.getAllPlayers().filter(x => this._boundEntities.valueHas(x.id));
    }
    _unboundEntities = new TwoWayMap();
    _boundEntities = new TwoWayMap();
    constructor(_vc) {
        this._vc = _vc;
        world.afterEvents.playerLeave.subscribe((ev) => this.OnPlayerLeftEvent(ev));
        _vc.OnNetworkEntityCreatedPacket.Subscribe((data) => this.OnNetworkEntityCreatedPacketEvent(data));
        _vc.OnEntityDestroyedPacket.Subscribe((ev) => this.OnEntityDestroyedPacketEvent(ev));
        _vc.OnDisconnected.Subscribe((reason) => this.OnDisconnectedEvent(reason));
    }
    BindPlayer(bindingKey, player) {
        if (this._boundEntities.valueHas(player.id))
            return false;
        const entityId = this._unboundEntities.valueGet(bindingKey);
        if (entityId === undefined)
            return false;
        this._vc.SendPacket(new McApiSetEntityNameRequestPacket(entityId, player.name));
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(entityId, `Bound to player ${player.name}`));
        this._unboundEntities.delete(entityId);
        this._boundEntities.set(entityId, player.id);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerBind`, `${player.id}:${entityId}`);
        return true;
    }
    UnbindPlayer(playerId) {
        const entityId = this._boundEntities.valueGet(playerId);
        if (entityId === undefined)
            return false;
        this._vc.SendPacket(new McApiSetEntityNameRequestPacket(entityId, "New Client"));
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, ""));
        this._boundEntities.valueDelete(playerId);
        this.AssignEntity(entityId);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerUnbind`, `${playerId}:${entityId}`);
        return true;
    }
    GetBoundEntity(playerId) {
        return this._boundEntities.valueGet(playerId);
    }
    GetBoundPlayer(entityId) {
        return this._boundEntities.get(entityId);
    }
    //Handling
    AssignEntity(entityId) {
        let bindingKey = BindingSystem.GenerateRandomId(5);
        while (this._unboundEntities.valueHas(bindingKey)) {
            bindingKey = BindingSystem.GenerateRandomId(5);
        }
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, ""));
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(entityId, `Welcome! Your binding key is ${bindingKey}`));
        this._unboundEntities.set(entityId, bindingKey);
    }
    static GetRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static GenerateRandomId(length) {
        let id = '';
        for (let i = 0; i < length; i++) {
            id += this.IdTable[this.GetRandomInt(0, this.IdTable.length - 1)];
        }
        return id;
    }
    //Events
    OnPlayerLeftEvent(ev) {
        if (this._boundEntities.valueHas(ev.playerId))
            this.UnbindPlayer(ev.playerId);
    }
    OnNetworkEntityCreatedPacketEvent(ev) {
        this.AssignEntity(ev.Id);
    }
    OnEntityDestroyedPacketEvent(ev) {
        this._unboundEntities.delete(ev.Id);
        const playerId = this._boundEntities.get(ev.Id);
        if (playerId !== undefined) {
            this._boundEntities.delete(ev.Id);
            system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerUnbind`, `${playerId}:${ev.Id}`);
        }
    }
    OnDisconnectedEvent(_) {
        this._unboundEntities.clear();
        for (const entity of this._boundEntities.entries()) {
            system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerUnbind`, `${entity[1]}:${entity[0]}`);
        }
        this._boundEntities.clear();
    }
}
