import {EffectType, McApiPacketType} from "../../../Data/Enums";
import {IMcApiPacket} from "../IMcApiPacket";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {IAudioEffect} from "../../../Interfaces/IAudioEffect";
import {VisibilityEffect} from "../../../Effects/VisibilityEffect";
import {ProximityEffect} from "../../../Effects/ProximityEffect";
import {DirectionalEffect} from "../../../Effects/DirectionalEffect";
import {ProximityEchoEffect} from "../../../Effects/ProximityEchoEffect";
import {EchoEffect} from "../../../Effects/EchoEffect";
import {ProximityMuffleEffect} from "../../../Effects/ProximityMuffleEffect";
import {MuffleEffect} from "../../../Effects/MuffleEffect";

export class McApiSetEffectRequestPacket implements IMcApiPacket {
    constructor(bitmask: number = 0, effect?: IAudioEffect) {
        this._bitmask = bitmask;
        this._effect = effect;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.SetEffectRequest;
    }

    public get Bitmask(): number {
        return this._bitmask;
    }

    public get EffectType(): EffectType {
        return this._effect?.EffectType ?? EffectType.None;
    }

    public get Effect(): IAudioEffect | undefined {
        return this._effect;
    }

    private _bitmask: number;
    private _effect?: IAudioEffect;

    public Serialize(writer: NetDataWriter) {
        writer.PutUshort(this._bitmask);
        writer.PutByte(this._effect?.EffectType ?? EffectType.None);
        if (this._effect !== undefined)
            this._effect.Serialize(writer);
    }

    public Deserialize(reader: NetDataReader) {
        this._bitmask = reader.GetUshort();
        const effectType = reader.GetByte() as EffectType;
        switch (effectType) {
            case EffectType.Visibility:
                this._effect = new VisibilityEffect();
                break;
            case EffectType.Proximity:
                this._effect = new ProximityEffect();
                break;
            case EffectType.Directional:
                this._effect = new DirectionalEffect();
                break;
            case EffectType.ProximityEcho:
                this._effect = new ProximityEchoEffect();
                break;
            case EffectType.Echo:
                this._effect = new EchoEffect();
                break;
            case EffectType.ProximityMuffle:
                this._effect = new ProximityMuffleEffect();
                break;
            case EffectType.Muffle:
                this._effect = new MuffleEffect();
                break;
            case EffectType.None:
            default:
                this._effect = undefined;
                break;
        }

        this._effect?.Deserialize(reader);
    }

    public Set(bitmask: number = 0, effect?: IAudioEffect) {
        this._bitmask = bitmask;
        this._effect = effect;
    }
}
