import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {EventType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {Vector3} from "../../../Data/Vector3";

export class McApiOnEntityPositionUpdatedPacket implements IMcApiEventPacket {
    constructor(id: number = 0, value: Vector3 = new Vector3()) {
        this._id = id;
        this._value = value;
    }

    public get EventType(): EventType {
        return EventType.OnEntityPositionUpdated;
    }

    public get Id(): number {
        return this._id;
    }

    public get Value(): Vector3 {
        return this._value;
    }

    private _id: number;
    private _value: Vector3;

    public Serialize(writer: NetDataWriter): void {
        writer.PutInt(this._id);
        writer.PutFloat(this._value.X);
        writer.PutFloat(this._value.Y);
        writer.PutFloat(this._value.Z);
    }

    public Deserialize(reader: NetDataReader): void {
        this._id = reader.GetInt();
        this._value = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
    }

    public Set(id: number = 0, value: Vector3 = new Vector3()) {
        this._id = id;
        this._value = value;
    }
}