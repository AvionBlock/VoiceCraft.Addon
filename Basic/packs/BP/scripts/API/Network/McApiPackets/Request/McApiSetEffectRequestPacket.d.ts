import { EffectType, McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { IAudioEffect } from "../../../Interfaces/IAudioEffect";
export declare class McApiSetEffectRequestPacket implements IMcApiPacket {
    constructor(token?: string, bitmask?: number, effect?: IAudioEffect);
    get PacketType(): McApiPacketType;
    get Token(): string;
    get Bitmask(): number;
    get EffectType(): EffectType;
    get Effect(): IAudioEffect | undefined;
    private _token;
    private _bitmask;
    private _effectType;
    private _effect?;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(token?: string, bitmask?: number, effect?: IAudioEffect): McApiSetEffectRequestPacket;
}
