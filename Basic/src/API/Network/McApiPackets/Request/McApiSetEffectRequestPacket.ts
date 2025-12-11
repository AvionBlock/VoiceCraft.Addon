import {EffectType, McApiPacketType} from "../../../Data/Enums";
import {IMcApiPacket} from "../IMcApiPacket";
import {NetDataWriter} from "../../NetDataWriter";
import {NetDataReader} from "../../NetDataReader";
import {MaxStringLength} from "../../../Data/Constants";
import {IAudioEffect} from "../../../Interfaces/IAudioEffect";

export class McApiSetEffectRequestPacket implements IMcApiPacket {
    constructor(token: string = "", bitmask: number = 0, effect?: IAudioEffect) {
        this._token = token;
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? EffectType.None;
        this._effect = effect;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.SetEffectRequest;
    }

    public get Token(): string {
        return this._token;
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

    private _token: string;
    private _bitmask: number;
    private _effectType: EffectType;
    private _effect?: IAudioEffect;

    public Serialize(writer: NetDataWriter) {
        writer.PutString(this._token, MaxStringLength);
        writer.PutUshort(this._bitmask);
        writer.PutByte(this._effect?.EffectType ?? EffectType.None);
        if (this._effect !== undefined)
            this._effect.Serialize(writer);
    }

    public Deserialize(reader: NetDataReader) {
        this._token = reader.GetString(MaxStringLength);
        this._bitmask = reader.GetUshort();
        this._effectType = reader.GetByte() as EffectType;
    }

    public Set(token: string = "", bitmask: number = 0, effect?: IAudioEffect): McApiSetEffectRequestPacket {
        this._token = token;
        this._bitmask = bitmask;
        this._effectType = effect?.EffectType ?? EffectType.None;
        this._effect = effect;
        return this;
    }
}
