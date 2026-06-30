import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";

export class McApiOnEntityVisibilityUpdatedPacket implements IMcApiEventPacket {
    constructor(id: number = 0, id2: number = 0, value: boolean = false) {
        this._id = id;
        this._id2 = id2;
        this._value = value;
    }

    public get EventType(): EventType {
        return EventType.OnEntityVisibilityUpdated;
    }

    public get Id(): number {
        return this._id;
    }

    public get Id2(): number {
        return this._id2;
    }

    public get Value(): boolean {
        return this._value;
    }

    private _id: number;
    private _id2: number;
    private _value: boolean;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutInt(this._id2);
        writer.PutBool(this._value);
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._id2 = reader.GetInt();
        this._value = reader.GetBool();
    }

    public Set(id: number = 0, id2: number = 0, value: boolean = false) {
        this._id = id;
        this._id2 = id2;
        this._value = value;
    }
}