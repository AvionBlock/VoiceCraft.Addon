import { VoiceCraft } from "../API/VoiceCraft";
export declare class BindingManager {
    private _vc;
    private readonly _unbindedEntities;
    private readonly _bindedEntities;
    constructor(_vc: VoiceCraft);
    BindPlayer(bindingKey: string, value: string): boolean;
    UnbindPlayer(playerId: string): boolean;
    GetEntityFromPlayerId(playerId: string): number | undefined;
    private OnNetworkEntityCreatedPacketEvent;
    private OnEntityDestroyedPacketEvent;
    private OnDisconnectedEvent;
    private GetRandomInt;
}
