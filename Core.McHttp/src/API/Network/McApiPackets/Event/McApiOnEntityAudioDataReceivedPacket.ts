import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataReader} from "../../../Data/NetDataReader";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {MaximumEncodedBytes} from "../../../Data/Constants";

export class McApiOnEntityAudioDataReceivedPacket implements IMcApiEventPacket {
    constructor(
        id: number = 0,
        timestamp: number = 0,
        loudness: number = 0.0,
        length: number = 0,
        buffer: Uint8Array = new Uint8Array(0)) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        this._length = length;
        this._buffer = buffer;
    }

    public get EventType(): EventType {
        return EventType.OnEntityAudioDataReceived;
    }

    public get Id(): number {
        return this._id;
    }

    public get Timestamp(): number {
        return this._timestamp;
    }

    public get FrameLoudness(): number {
        return this._frameLoudness;
    }

    public get Length() {
        return this._length;
    }

    public get Buffer(): Uint8Array {
        return this._buffer;
    }

    private _id: number;
    private _timestamp: number;
    private _frameLoudness: number;
    private _length: number;
    private _buffer: Uint8Array;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutUshort(this._timestamp);
        writer.PutFloat(this._frameLoudness);
        writer.PutBytes(this._buffer, 0, this._length);
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._timestamp = reader.GetUshort();
        this._frameLoudness = reader.GetFloat();
        this._length = reader.AvailableBytes;
        if (this._length > MaximumEncodedBytes)
            throw new Error(`Array length exceeds maximum number of bytes per packet! Got ${this._length} bytes.`);
        this._buffer = new Uint8Array(this._length);
        reader.GetBytes(this._buffer, this._length);
    }

    public Set(
        id: number = 0,
        timestamp: number = 0,
        loudness: number = 0.0,
        length: number = 0,
        buffer: Uint8Array = new Uint8Array(0)) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        this._length = length;
        this._buffer = buffer;
    }
}