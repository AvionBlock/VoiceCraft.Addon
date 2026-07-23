import { EventType } from "../../../Data/Enums";
import { MaximumEncodedBytes } from "../../../Data/Constants";
export class McApiOnEntityAudioDataReceivedPacket {
    constructor(id = 0, timestamp = 0, loudness = 0.0, length = 0, buffer = new Uint8Array(0)) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        this._length = length;
        this._buffer = buffer;
    }
    get EventType() {
        return EventType.OnEntityAudioDataReceived;
    }
    get Id() {
        return this._id;
    }
    get Timestamp() {
        return this._timestamp;
    }
    get FrameLoudness() {
        return this._frameLoudness;
    }
    get Length() {
        return this._length;
    }
    get Buffer() {
        return this._buffer;
    }
    _id;
    _timestamp;
    _frameLoudness;
    _length;
    _buffer;
    Serialize(writer) {
        writer.PutInt(this._id);
        writer.PutUshort(this._timestamp);
        writer.PutFloat(this._frameLoudness);
        writer.PutBytes(this._buffer, 0, this._length);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._timestamp = reader.GetUshort();
        this._frameLoudness = reader.GetFloat();
        this._length = reader.AvailableBytes;
        if (this._length > MaximumEncodedBytes)
            throw new Error(`Array length exceeds maximum number of bytes per packet! Got ${this._length} bytes.`);
        this._buffer = new Uint8Array(this._length);
        reader.GetBytes(this._buffer, this._length);
    }
    Set(id = 0, timestamp = 0, loudness = 0.0, length = 0, buffer = new Uint8Array(0)) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        this._length = length;
        this._buffer = buffer;
    }
}
