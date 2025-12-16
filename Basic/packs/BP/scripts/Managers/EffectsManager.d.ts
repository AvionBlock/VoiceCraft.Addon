import { VoiceCraft } from "../API/VoiceCraft";
import { IAudioEffect } from "../API/Interfaces/IAudioEffect";
export declare class EffectsManager {
    private _vc;
    Effects: Map<number, IAudioEffect>;
    constructor(_vc: VoiceCraft);
    SetEffect(bitmask: number, effect: IAudioEffect | undefined): void;
    private OnEffectUpdatedEvent;
    private OnDisconnectedEvent;
}
