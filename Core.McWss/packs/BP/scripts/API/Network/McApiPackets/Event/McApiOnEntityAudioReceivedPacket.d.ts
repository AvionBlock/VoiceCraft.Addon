import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataReader } from "../../../Data/NetDataReader";
import { NetDataWriter } from "../../../Data/NetDataWriter";
export declare class McApiOnEntityAudioReceivedPacket implements IMcApiEventPacket {
    constructor(id?: number, timestamp?: number, loudness?: number);
    get EventType(): EventType;
    get Id(): number;
    get Timestamp(): number;
    get FrameLoudness(): number;
    private _id;
    private _timestamp;
    private _frameLoudness;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, timestamp?: number, loudness?: number): void;
}
