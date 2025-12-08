export class McApiOnEntityAudioReceivedPacket {
    constructor(id = 0, timestamp = 0, loudness = 0.0) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
    }
    get PacketType() {
        return 21 /* McApiPacketType.OnEntityAudioReceived */;
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
    _id;
    _timestamp;
    _frameLoudness;
    Serialize(writer) {
        writer.PutInt(this._id);
        writer.PutUshort(this._timestamp);
        writer.PutFloat(this._frameLoudness);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._timestamp = reader.GetUshort();
        this._frameLoudness = reader.GetFloat();
    }
    Set(id = 0, timestamp = 0, loudness = 0.0) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        return this;
    }
}
