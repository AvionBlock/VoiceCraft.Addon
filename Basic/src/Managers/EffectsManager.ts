import {VoiceCraft} from "../API/VoiceCraft";
import {McApiOnEffectUpdatedPacket} from "../API/Network/McApiPackets/Event/McApiOnEffectUpdatedPacket";
import {IAudioEffect} from "../API/Interfaces/IAudioEffect";
import {McApiSetEffectRequestPacket} from "../API/Network/McApiPackets/Request/McApiSetEffectRequestPacket";

export class EffectsManager {
    public Effects: Map<number, IAudioEffect> = new Map();

    constructor(private _vc: VoiceCraft) {
        this._vc.OnDisconnected.Subscribe((reason: string)=> this.OnDisconnectedEvent(reason));
        this._vc.OnEffectUpdatedPacket.Subscribe((ev: McApiOnEffectUpdatedPacket) => this.OnEffectUpdatedEvent(ev));
    }

    public SetEffect(bitmask: number, effect: IAudioEffect | undefined): void {
        this._vc.SendPacket(new McApiSetEffectRequestPacket(bitmask, effect));
    }

    private OnEffectUpdatedEvent(ev: McApiOnEffectUpdatedPacket) {
        if(ev.Effect === undefined) {
            this.Effects.delete(ev.Bitmask);
            return;
        }
        this.Effects.set(ev.Bitmask, ev.Effect);
    }

    private OnDisconnectedEvent(_: string) {
        this.Effects.clear();
    }
}