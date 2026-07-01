import { EventType } from "../../../Data/Enums";
import { Vector3 } from "../../../Data/Vector3";
export class McApiOnEntityPositionUpdatedPacket {
    constructor(id = 0, value = new Vector3()) {
        this._id = id;
        this._value = value;
    }
    get EventType() {
        return EventType.OnEntityPositionUpdated;
    }
    get Id() {
        return this._id;
    }
    get Value() {
        return this._value;
    }
    _id;
    _value;
    Serialize(writer) {
        writer.PutInt(this._id);
        writer.PutFloat(this._value.X);
        writer.PutFloat(this._value.Y);
        writer.PutFloat(this._value.Z);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
    }
    Set(id = 0, value = new Vector3()) {
        this._id = id;
        this._value = value;
    }
}
