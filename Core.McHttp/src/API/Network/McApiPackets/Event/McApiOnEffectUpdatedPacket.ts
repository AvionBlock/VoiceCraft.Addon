import {EffectType, McApiPacketType} from "../../../Data/Enums";
import {IMcApiPacket} from "../IMcApiPacket";
import {NetDataWriter} from "../../NetDataWriter";
import {NetDataReader} from "../../NetDataReader";
import {IAudioEffect} from "../../../Interfaces/IAudioEffect";
import {VisibilityEffect} from "../../../Effects/VisibilityEffect";
import {ProximityEffect} from "../../../Effects/ProximityEffect";
import {DirectionalEffect} from "../../../Effects/DirectionalEffect";
import {ProximityEchoEffect} from "../../../Effects/ProximityEchoEffect";
import {EchoEffect} from "../../../Effects/EchoEffect";

export class McApiOnEffectUpdatedPacket implements IMcApiPacket {
    constructor(bitmask: number = 0, effect?: IAudioEffect) {
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? EffectType.None;
        this._effect = effect;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.OnEffectUpdated;
    }

    public get Bitmask(): number {
        return this._bitmask;
    }

    public get EffectType(): EffectType {
        return this._effectType;
    }

    public get Effect(): IAudioEffect | undefined {
        return this._effect;
    }

    private _bitmask: number;
    private _effectType: EffectType;
    private _effect?: IAudioEffect;

    public Serialize(writer: NetDataWriter) {
        writer.PutUshort(this._bitmask);
        writer.PutByte(this._effect?.EffectType ?? EffectType.None);
        if (this._effect !== undefined)
            this._effect.Serialize(writer);
    }

    public Deserialize(reader: NetDataReader) {
        this._bitmask = reader.GetUshort();
        this._effectType = reader.GetByte() as EffectType;
        switch(this._effectType)
        {
            case EffectType.None:
                this._effect = undefined;
                break;
            case EffectType.Visibility:
                this._effect = new VisibilityEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.Proximity:
                this._effect = new ProximityEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.Directional:
                this._effect = new DirectionalEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.ProximityEcho:
                this._effect = new ProximityEchoEffect();
                this._effect.Deserialize(reader);
                break;
            case EffectType.Echo:
                this._effect = new EchoEffect();
                this._effect.Deserialize(reader);
                break;
        }
    }

    public Set(bitmask: number = 0, effect?: IAudioEffect): McApiOnEffectUpdatedPacket {
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? EffectType.None;
        this._effect = effect;
        return this;
    }
}
