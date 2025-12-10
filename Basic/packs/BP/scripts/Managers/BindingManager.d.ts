import { VoiceCraft } from "../API/VoiceCraft";
export declare class BindingManager {
    private _vc;
    private readonly _unbindedEntities;
    private readonly _bindedEntities;
    constructor(_vc: VoiceCraft);
    BindEntity(bindingKey: string, value: string): boolean;
    private OnNetworkEntityCreatedPacketEvent;
    private OnEntityDestroyedPacketEvent;
    private GetRandomInt;
}
