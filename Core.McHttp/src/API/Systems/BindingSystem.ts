import {VoiceCraft} from "../VoiceCraft";
import {Player, PlayerLeaveAfterEvent, system, world} from "@minecraft/server";
import {TwoWayMap} from "../Data/TwoWayMap";
import {McApiSetEntityNameRequestPacket} from "../Network/McApiPackets/Request/McApiSetEntityNameRequestPacket";
import {
    McApiSetEntityDescriptionRequestPacket
} from "../Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import {McApiSetEntityWorldIdRequestPacket} from "../Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
import {McApiOnNetworkEntityCreatedPacket} from "../Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import {McApiOnEntityDestroyedPacket} from "../Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";

export class BindingSystem {
    public static IdTable = [
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

    public get UnboundEntities(): ReadonlyMap<number, string> {
        return this._unboundEntities;
    }

    public get BoundEntities(): ReadonlyMap<number, string> {
        return this._boundEntities;
    }

    public get BoundPlayers() {
        return world.getAllPlayers().filter(x => this._boundEntities.valueHas(x.id));
    }

    private readonly _unboundEntities: TwoWayMap<number, string> = new TwoWayMap<
        number,
        string
    >();
    private readonly _boundEntities: TwoWayMap<number, string> = new TwoWayMap<
        number,
        string
    >();

    constructor(private readonly _vc: VoiceCraft) {
        world.afterEvents.playerLeave.subscribe((ev) => this.OnPlayerLeftEvent(ev));
        _vc.OnNetworkEntityCreatedPacket.Subscribe((data: McApiOnNetworkEntityCreatedPacket) =>
            this.OnNetworkEntityCreatedPacketEvent(data));
        _vc.OnEntityDestroyedPacket.Subscribe((ev: McApiOnEntityDestroyedPacket) =>
            this.OnEntityDestroyedPacketEvent(ev));
        _vc.OnDisconnected.Subscribe((reason: string) => this.OnDisconnectedEvent(reason));
    }

    public BindPlayer(bindingKey: string, player: Player): boolean {
        if (this._boundEntities.valueHas(player.id)) return false;
        const entityId = this._unboundEntities.valueGet(bindingKey);
        if (entityId === undefined) return false;
        this._vc.SendPacket(new McApiSetEntityNameRequestPacket(entityId, player.name));
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(entityId, `Bound to player ${player.name}`));
        this._unboundEntities.delete(entityId);
        this._boundEntities.set(entityId, player.id);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerBind`, `${player.id}:${entityId}`);
        return true;
    }

    public UnbindPlayer(playerId: string): boolean {
        const entityId = this._boundEntities.valueGet(playerId);
        if (entityId === undefined) return false;
        this._vc.SendPacket(new McApiSetEntityNameRequestPacket(entityId, "New Client"));
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, ""));
        this._boundEntities.valueDelete(playerId);
        this.AssignEntity(entityId);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerUnbind`, `${playerId}:${entityId}`);
        return true;
    }

    public GetBoundEntity(playerId: string): number | undefined {
        return this._boundEntities.valueGet(playerId);
    }

    public GetBoundPlayer(entityId: number): string | undefined {
        return this._boundEntities.get(entityId);
    }

    //Handling
    private AssignEntity(entityId: number) {
        let bindingKey = BindingSystem.GenerateRandomId(5);
        while (this._unboundEntities.valueHas(bindingKey)) {
            bindingKey = BindingSystem.GenerateRandomId(5);
        }
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, ""));
        this._vc.SendPacket(new McApiSetEntityDescriptionRequestPacket(entityId,
            `Welcome! Your binding key is ${bindingKey}`));
        this._unboundEntities.set(entityId, bindingKey);
    }

    private static GetRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private static GenerateRandomId(length: number) {
        let id = '';
        for (let i = 0; i < length; i++) {
            id += this.IdTable[this.GetRandomInt(0, this.IdTable.length - 1)];
        }
        return id;
    }

    //Events
    private OnPlayerLeftEvent(ev: PlayerLeaveAfterEvent) {
        if (this._boundEntities.valueHas(ev.playerId))
            this.UnbindPlayer(ev.playerId);
    }

    private OnNetworkEntityCreatedPacketEvent(ev: McApiOnNetworkEntityCreatedPacket) {
        this.AssignEntity(ev.Id);
    }

    private OnEntityDestroyedPacketEvent(ev: McApiOnEntityDestroyedPacket) {
        this._unboundEntities.delete(ev.Id);
        const playerId = this._boundEntities.get(ev.Id);
        if (playerId !== undefined) {
            this._boundEntities.delete(ev.Id);
            system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerUnbind`, `${playerId}:${ev.Id}`);
        }
    }

    private OnDisconnectedEvent(_: string) {
        this._unboundEntities.clear();
        for (const entity of this._boundEntities.entries()) {
            system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerUnbind`, `${entity[1]}:${entity[0]}`);
        }
        this._boundEntities.clear();
    }
}