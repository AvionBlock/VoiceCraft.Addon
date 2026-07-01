import { EventType } from "../../../Data/Enums";
export class McApiOnEntityDestroyedPacket {
    constructor(id = 0) {
        this._id = id;
    }
    get EventType() {
        return EventType.OnEntityDestroyed;
    }
    get Id() {
        return this._id;
    }
    _id;
    Serialize(writer) {
        writer.PutInt(this._id);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
    }
    Set(id = 0) {
        this._id = id;
    }
}
