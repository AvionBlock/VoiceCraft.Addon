import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {MaxStringLength} from "../../../Data/Constants";

export class McApiOnEntityNameUpdatedPacket implements IMcApiEventPacket {
    constructor(id: number = 0, value: string = "") {
        this._id = id;
        this._value = value;
    }

    public get EventType(): EventType {
        return EventType.OnEntityNameUpdated;
    }

    public get Id(): number {
        return this._id;
    }

    public get Value(): string {
        return this._value;
    }

    private _id: number;
    private _value: string;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutString(this._value);
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._value = reader.GetString(MaxStringLength);
    }

    public Set(id: number = 0, value: string = "") {
        this._id = id;
        this._value = value;
    }
}