import { VoiceCraft } from "../API/VoiceCraft";
import { Player } from "@minecraft/server";
export declare class BindingManager {
    private _vc;
    private static readonly IdTable;
    private readonly _unbindedEntities;
    private readonly _bindedEntities;
    constructor(_vc: VoiceCraft);
    BindPlayer(bindingKey: string, value: Player): boolean;
    UnbindPlayer(playerId: string): boolean;
    GetEntityFromPlayerId(playerId: string): number | undefined;
    private OnNetworkEntityCreatedPacketEvent;
    private OnEntityDestroyedPacketEvent;
    private OnDisconnectedEvent;
    private GetRandomInt;
    private GenerateRandomId;
}
