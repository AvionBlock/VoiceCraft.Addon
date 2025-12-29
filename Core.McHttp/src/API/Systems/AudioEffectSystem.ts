import {IAudioEffect} from "../Interfaces/IAudioEffect";
import {VoiceCraft} from "../VoiceCraft";
import {McApiOnEffectUpdatedPacket} from "../Network/McApiPackets/Event/McApiOnEffectUpdatedPacket";
import {McApiSetEffectRequestPacket} from "../Network/McApiPackets/Request/McApiSetEffectRequestPacket";
import {McApiClearEffectsRequestPacket} from "../Network/McApiPackets/Request/McApiClearEffectsRequestPacket";

export class AudioEffectSystem {
    public Effects: Map<number, IAudioEffect> = new Map();

    constructor(private _vc: VoiceCraft) {
        this._vc.OnDisconnected.Subscribe((reason: string) => this.OnDisconnectedEvent(reason));
        this._vc.OnEffectUpdatedPacket.Subscribe((ev: McApiOnEffectUpdatedPacket) => this.OnEffectUpdatedEvent(ev));
    }

    public SetEffect(bitmask: number, effect: IAudioEffect | undefined) {
        this._vc.SendPacket(new McApiSetEffectRequestPacket(bitmask, effect));
    }

    public Clear() {
        this._vc.SendPacket(new McApiClearEffectsRequestPacket());
    }

    private OnEffectUpdatedEvent(ev: McApiOnEffectUpdatedPacket) {
        if (ev.Effect === undefined) {
            this.Effects.delete(ev.Bitmask);
            return;
        }
        this.Effects.set(ev.Bitmask, ev.Effect);
    }

    private OnDisconnectedEvent(_: string) {
        this.Effects.clear();
    }
}