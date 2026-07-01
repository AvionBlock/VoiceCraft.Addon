import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
export declare class McApiOnEntityCreatedPacket implements IMcApiEventPacket {
    constructor(id?: number, loudness?: number, lastSpoke?: bigint);
    get EventType(): EventType;
    get Id(): number;
    get Loudness(): number;
    get LastSpoke(): bigint;
    private _id;
    private _loudness;
    private _lastSpoke;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, loudness?: number, lastSpoke?: bigint): void;
}
