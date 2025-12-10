import { Vector2 } from "../../../Data/Vector2";
export class McApiOnEntityRotationUpdatedPacket {
    constructor(id = 0, value = new Vector2(0, 0)) {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 29 /* McApiPacketType.OnEntityRotationUpdated */;
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
        writer.PutInt(this.Id);
        writer.PutFloat(this._value.X);
        writer.PutFloat(this._value.Y);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = new Vector2(reader.GetFloat(), reader.GetFloat());
    }
    Set(id = 0, value = new Vector2(0, 0)) {
        this._id = id;
        this._value = value;
        return this;
    }
}
