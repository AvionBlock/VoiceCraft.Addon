import { McApiPacketType } from "../../../Data/Enums";
import { MaximumEncodedBytes } from "../../../Data/Constants";
export class McApiEntityAudioRequestPacket {
    constructor(id = 0, timestamp = 0, loudness = 0.0, length = 0, data = new Uint8Array(0)) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        this._length = length;
        this._data = data;
    }
    get PacketType() {
        return McApiPacketType.EntityAudioRequest;
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
    get Data() {
        return this._data;
    }
    _id;
    _timestamp;
    _frameLoudness;
    _length;
    _data;
    Serialize(writer) {
        writer.PutInt(this.Id);
        writer.PutUshort(this.Timestamp);
        writer.PutFloat(this.FrameLoudness);
        writer.PutBytes(this.Data, 0, this.Length);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._timestamp = reader.GetUshort();
        this._frameLoudness = reader.GetFloat();
        this._length = reader.AvailableBytes;
        if (this._length > MaximumEncodedBytes)
            throw new Error(`Array length exceeds maximum number of bytes per packet! Got ${this._length} bytes.`);
        this._data = new Uint8Array(this._length);
        reader.GetBytes(this._data, this._length);
    }
    Set(id = 0, timestamp = 0, loudness = 0.0, length = 0, data = new Uint8Array(0)) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        this._length = length;
        this._data = data;
        return this;
    }
}
