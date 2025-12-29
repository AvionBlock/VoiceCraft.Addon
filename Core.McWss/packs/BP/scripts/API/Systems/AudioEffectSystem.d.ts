import { IAudioEffect } from "../Interfaces/IAudioEffect";
import { VoiceCraft } from "../VoiceCraft";
export declare class AudioEffectSystem {
    private _vc;
    Effects: Map<number, IAudioEffect>;
    constructor(_vc: VoiceCraft);
    SetEffect(bitmask: number, effect: IAudioEffect | undefined): void;
    Clear(): void;
    private OnEffectUpdatedEvent;
    private OnDisconnectedEvent;
}
