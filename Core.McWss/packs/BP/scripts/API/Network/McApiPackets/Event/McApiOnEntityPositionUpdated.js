import { Vector3 } from "../../../Data/Vector3";
export class McApiOnEntityPositionUpdatedPacket {
    constructor(id = 0, value = new Vector3(0, 0, 0)) {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 28 /* McApiPacketType.OnEntityPositionUpdated */;
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
        writer.PutFloat(this._value.Z);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
    }
    Set(id = 0, value = new Vector3(0, 0, 0)) {
        this._id = id;
        this._value = value;
        return this;
    }
}
