import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";

export class McApiOnEntityCreatedPacket implements IMcApiEventPacket {
    constructor(id: number = 0, loudness: number = 0.0, lastSpoke: bigint = 0n) {
        this._id = id;
        this._loudness = loudness;
        this._lastSpoke = lastSpoke;
    }

    public get EventType(): EventType {
        return EventType.OnEntityCreated;
    }

    public get Id(): number {
        return this._id;
    }

    public get Loudness(): number {
        return this._loudness;
    }

    public get LastSpoke(): bigint {
        return this._lastSpoke;
    }

    private _id: number;
    private _loudness: number;
    private _lastSpoke: bigint;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutFloat(this._loudness);
        writer.PutLong(this._lastSpoke)
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._loudness = reader.GetFloat();
        this._lastSpoke = reader.GetLong();
    }

    public Set(id: number = 0, loudness: number = 0.0, lastSpoke: bigint = 0n) {
        this._id = id;
        this._loudness = loudness;
        this._lastSpoke = lastSpoke;
    }
}