import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {Vector2} from "../../../Data/Vector2";

export class McApiOnEntityRotationUpdatedPacket implements IMcApiEventPacket {
    constructor(id: number = 0, value: Vector2 = new Vector2()) {
        this._id = id;
        this._value = value;
    }

    public get EventType(): EventType {
        return EventType.OnEntityRotationUpdated;
    }

    public get Id(): number {
        return this._id;
    }

    public get Value(): Vector2 {
        return this._value;
    }

    private _id: number;
    private _value: Vector2;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutFloat(this._value.X);
        writer.PutFloat(this._value.Y);
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._value = new Vector2(reader.GetFloat(), reader.GetFloat());
    }

    public Set(id: number = 0, value: Vector2 = new Vector2()) {
        this._id = id;
        this._value = value;
    }
}