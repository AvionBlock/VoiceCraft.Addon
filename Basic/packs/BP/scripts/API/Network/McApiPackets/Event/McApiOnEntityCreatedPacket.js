import { EventType } from "../../../Data/Enums";
export class McApiOnEntityCreatedPacket {
    constructor(id = 0, loudness = 0.0, lastSpoke = 0n) {
        this._id = id;
        this._loudness = loudness;
        this._lastSpoke = lastSpoke;
    }
    get EventType() {
        return EventType.OnEntityCreated;
    }
    get Id() {
        return this._id;
    }
    get Loudness() {
        return this._loudness;
    }
    get LastSpoke() {
        return this._lastSpoke;
    }
    _id;
    _loudness;
    _lastSpoke;
    Serialize(writer) {
        writer.PutInt(this._id);
        writer.PutFloat(this._loudness);
        writer.PutLong(this._lastSpoke);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._loudness = reader.GetFloat();
        this._lastSpoke = reader.GetLong();
    }
    Set(id = 0, loudness = 0.0, lastSpoke = 0n) {
        this._id = id;
        this._loudness = loudness;
        this._lastSpoke = lastSpoke;
    }
}
