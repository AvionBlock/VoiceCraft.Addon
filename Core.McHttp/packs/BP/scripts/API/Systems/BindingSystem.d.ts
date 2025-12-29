import { VoiceCraft } from "../VoiceCraft";
import { Player } from "@minecraft/server";
export declare class BindingSystem {
    private readonly _vc;
    static IdTable: string[];
    get UnboundEntities(): ReadonlyMap<number, string>;
    get BoundEntities(): ReadonlyMap<number, string>;
    get BoundPlayers(): Player[];
    private readonly _unboundEntities;
    private readonly _boundEntities;
    constructor(_vc: VoiceCraft);
    BindPlayer(bindingKey: string, player: Player): boolean;
    UnbindPlayer(playerId: string): boolean;
    GetBoundEntity(playerId: string): number | undefined;
    GetBoundPlayer(entityId: number): string | undefined;
    private AssignEntity;
    private static GetRandomInt;
    private static GenerateRandomId;
    private OnPlayerLeftEvent;
    private OnNetworkEntityCreatedPacketEvent;
    private OnEntityDestroyedPacketEvent;
    private OnDisconnectedEvent;
}
