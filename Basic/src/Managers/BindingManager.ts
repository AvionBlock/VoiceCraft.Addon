import {VoiceCraft} from "../API/VoiceCraft";
import {TwoWayMap} from "../API/Data/TwoWayMap";
import {McApiOnNetworkEntityCreatedPacket} from "../API/Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import {
    McApiSetEntityDescriptionRequestPacket
} from "../API/Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import {McApiOnEntityDestroyedPacket} from "../API/Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";
import {Player, PlayerLeaveAfterEvent, system, world} from "@minecraft/server";
import {
    McApiSetEntityWorldIdRequestPacket
} from "../API/Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
import {McApiSetEntityNameRequestPacket} from "../API/Network/McApiPackets/Request/McApiSetEntityNameRequestPacket";

export class BindingManager {
    private static readonly IdTable = [
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

    private readonly _unbindedEntities: TwoWayMap<number, string> = new TwoWayMap<
        number,
        string
    >();
    private readonly _bindedEntities: TwoWayMap<number, string> = new TwoWayMap<
        number,
        string
    >();

    constructor(private _vc: VoiceCraft) {
        world.afterEvents.playerLeave.subscribe((ev) => this.OnPlayerLeftEvent(ev))
        _vc.OnNetworkEntityCreatedPacket.Subscribe(
            (ev: McApiOnNetworkEntityCreatedPacket) =>
                this.OnNetworkEntityCreatedPacketEvent(ev)
        );

        _vc.OnEntityDestroyedPacket.Subscribe((ev: McApiOnEntityDestroyedPacket) =>
            this.OnEntityDestroyedPacketEvent(ev)
        );

        _vc.OnDisconnected.Subscribe((reason: string) => this.OnDisconnectedEvent(reason));
    }

    public GetBindedPlayers() {
        return world.getAllPlayers().filter(x => this._bindedEntities.valueHas(x.id));
    }

    public BindPlayer(bindingKey: string, player: Player): boolean {
        if (this._bindedEntities.valueHas(player.id)) return false;
        const entityId = this._unbindedEntities.valueGet(bindingKey);
        if (entityId === undefined) return false;
        this._unbindedEntities.delete(entityId);
        this._bindedEntities.set(entityId, player.id);

        this._vc.SendPacket(new McApiSetEntityNameRequestPacket(entityId, player.name));
        this._vc.SendPacket(
            new McApiSetEntityDescriptionRequestPacket(
                entityId,
                `Bound to player ${player.name}`
            )
        );
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerBind`, `${player.id}:${entityId}`);
        return true;
    }

    public UnbindPlayer(playerId: string): boolean {
        const entityId = this._bindedEntities.valueGet(playerId);
        if (entityId === undefined) return false;
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, ""));
        this._bindedEntities.valueDelete(playerId);

        let bindingKey = this.GenerateRandomId(5);
        while (this._unbindedEntities.valueHas(bindingKey)) {
            bindingKey = this.GenerateRandomId(5);
        }

        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(entityId, ""));
        this._vc.SendPacket(
            new McApiSetEntityDescriptionRequestPacket(
                entityId,
                `Welcome! Your binding key is ${bindingKey}`
            )
        );
        this._unbindedEntities.set(entityId, bindingKey);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onPlayerUnbind`, `${playerId}:${entityId}`);
        return true;
    }

    public GetEntityFromPlayerId(playerId: string): number | undefined {
        return this._bindedEntities.valueGet(playerId);
    }

    private OnPlayerLeftEvent(ev: PlayerLeaveAfterEvent) {
        if (this._bindedEntities.valueHas(ev.playerId))
            this.UnbindPlayer(ev.playerId);
    }

    private OnNetworkEntityCreatedPacketEvent(
        ev: McApiOnNetworkEntityCreatedPacket
    ) {
        let bindingKey = this.GenerateRandomId(5);
        while (this._unbindedEntities.valueHas(bindingKey)) {
            bindingKey = this.GenerateRandomId(5);
        }

        this._unbindedEntities.set(ev.Id, bindingKey);
        console.log("Setting Binding Key");
        this._vc.SendPacket(new McApiSetEntityWorldIdRequestPacket(ev.Id, ""));
        this._vc.SendPacket(
            new McApiSetEntityDescriptionRequestPacket(
                ev.Id,
                `Welcome! Your binding key is ${bindingKey}`
            )
        );
    }

    private OnEntityDestroyedPacketEvent(ev: McApiOnEntityDestroyedPacket) {
        this._unbindedEntities.delete(ev.Id);
        const playerId = this._bindedEntities.get(ev.Id);
        if(playerId !== undefined)
        {
            this.UnbindPlayer(playerId);
        }
    }

    private OnDisconnectedEvent(_: string) {
        this._unbindedEntities.clear();
        this._bindedEntities.clear();
    }

    private GetRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private GenerateRandomId(length: number) {
        let id = '';
        for (let i = 0; i < length; i++) {
            id += BindingManager.IdTable[this.GetRandomInt(0, BindingManager.IdTable.length - 1)];
        }
        return id;
    }
}
