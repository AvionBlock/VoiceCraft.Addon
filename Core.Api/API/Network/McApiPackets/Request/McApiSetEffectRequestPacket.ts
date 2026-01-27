import {EffectType, McApiPacketType} from "../../../Data/Enums";
import {IMcApiPacket} from "../IMcApiPacket";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {IAudioEffect} from "../../../Interfaces/IAudioEffect";

export class McApiSetEffectRequestPacket implements IMcApiPacket {
    constructor(bitmask: number = 0, effect?: IAudioEffect) {
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? EffectType.None;
        this._effect = effect;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.SetEffectRequest;
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
        writer.PutUshort(this.Bitmask);
        writer.PutByte(this.Effect?.EffectType ?? EffectType.None);
        if (this._effect !== undefined)
            this._effect.Serialize(writer);
    }

    public Deserialize(reader: NetDataReader) {
        this._bitmask = reader.GetUshort();
        this._effectType = reader.GetByte() as EffectType;
    }

    public Set(bitmask: number = 0, effect?: IAudioEffect): McApiSetEffectRequestPacket {
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? EffectType.None;
        this._effect = effect;
        return this;
    }
}
