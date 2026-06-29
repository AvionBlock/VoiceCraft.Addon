import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";

export class McApiOnEntityEffectBitmaskUpdatedPacket implements IMcApiEventPacket {
    constructor(id: number = 0, value: number = 0) {
        this._id = id;
        this._value = value;
    }

    public get EventType(): EventType {
        return EventType.OnEntityEffectBitmaskUpdated;
    }

    public get Id(): number {
        return this._id;
    }

    public get Value(): number {
        return this._value;
    }

    private _id: number;
    private _value: number;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutUshort(this._value);
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._value = reader.GetUshort();
    }

    public Set(id: number = 0, value: number = 0) {
        this._id = id;
        this._value = value;
    }
}