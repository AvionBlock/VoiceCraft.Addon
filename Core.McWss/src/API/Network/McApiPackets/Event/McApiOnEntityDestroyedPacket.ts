import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";

export class McApiOnEntityDestroyedPacket implements IMcApiEventPacket {
    constructor(id: number = 0) {
        this._id = id;
    }

    public get EventType(): EventType {
        return EventType.OnEntityDestroyed;
    }

    public get Id(): number {
        return this._id;
    }

    private _id: number;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
    }

    public Set(id: number = 0) {
        this._id = id;
    }
}