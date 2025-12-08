import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
export declare class McApiOnEntityAudioReceivedPacket implements IMcApiPacket {
    constructor(id?: number, timestamp?: number, loudness?: number);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Timestamp(): number;
    get FrameLoudness(): number;
    private _id;
    private _timestamp;
    private _frameLoudness;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, timestamp?: number, loudness?: number): McApiOnEntityAudioReceivedPacket;
}
