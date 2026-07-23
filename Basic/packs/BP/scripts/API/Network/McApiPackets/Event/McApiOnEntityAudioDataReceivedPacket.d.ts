import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataReader } from "../../../Data/NetDataReader";
import { NetDataWriter } from "../../../Data/NetDataWriter";
export declare class McApiOnEntityAudioDataReceivedPacket implements IMcApiEventPacket {
    constructor(id?: number, timestamp?: number, loudness?: number, length?: number, buffer?: Uint8Array);
    get EventType(): EventType;
    get Id(): number;
    get Timestamp(): number;
    get FrameLoudness(): number;
    get Length(): number;
    get Buffer(): Uint8Array;
    private _id;
    private _timestamp;
    private _frameLoudness;
    private _length;
    private _buffer;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, timestamp?: number, loudness?: number, length?: number, buffer?: Uint8Array): void;
}
