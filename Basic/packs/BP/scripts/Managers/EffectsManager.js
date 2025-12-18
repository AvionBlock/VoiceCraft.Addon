import { McApiSetEffectRequestPacket } from "../API/Network/McApiPackets/Request/McApiSetEffectRequestPacket";
export class EffectsManager {
    _vc;
    Effects = new Map();
    constructor(_vc) {
        this._vc = _vc;
        this._vc.OnDisconnected.Subscribe((reason) => this.OnDisconnectedEvent(reason));
        this._vc.OnEffectUpdatedPacket.Subscribe((ev) => this.OnEffectUpdatedEvent(ev));
    }
    SetEffect(bitmask, effect) {
        this._vc.SendPacket(new McApiSetEffectRequestPacket(bitmask, effect));
    }
    OnEffectUpdatedEvent(ev) {
        if (ev.Effect === undefined) {
            this.Effects.delete(ev.Bitmask);
            return;
        }
        this.Effects.set(ev.Bitmask, ev.Effect);
    }
    OnDisconnectedEvent(_) {
        this.Effects.clear();
    }
}
