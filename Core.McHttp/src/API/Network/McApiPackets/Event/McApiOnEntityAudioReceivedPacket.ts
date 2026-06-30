import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataReader} from "../../../Data/NetDataReader";
import {NetDataWriter} from "../../../Data/NetDataWriter";

export class McApiOnEntityAudioReceivedPacket implements IMcApiEventPacket {
    constructor(id: number = 0, timestamp: number = 0, loudness: number = 0.0) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
    }

    public get EventType(): EventType {
        return EventType.OnEntityAudioReceived;
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

    private _id: number;
    private _timestamp: number;
    private _frameLoudness: number;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutUshort(this._timestamp);
        writer.PutFloat(this._frameLoudness);
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._timestamp = reader.GetUshort();
        this._frameLoudness = reader.GetFloat();
    }

    public Set(id: number = 0, timestamp: number = 0, loudness: number = 0.0) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
    }
}