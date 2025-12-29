import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
export declare class McApiEntityAudioRequestPacket implements IMcApiPacket {
    constructor(id?: number, timestamp?: number, loudness?: number, length?: number, data?: Uint8Array);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Timestamp(): number;
    get FrameLoudness(): number;
    get Length(): number;
    get Data(): Uint8Array;
    private _id;
    private _timestamp;
    private _frameLoudness;
    private _length;
    private _data;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, timestamp?: number, loudness?: number, length?: number, data?: Uint8Array): McApiEntityAudioRequestPacket;
}
