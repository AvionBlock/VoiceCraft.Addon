export class McApiOnEntityVisibilityUpdatedPacket {
    constructor(id = 0, id2 = 0, value = false) {
        this._id = id;
        this._id2 = id2;
        this._value = value;
    }
    get PacketType() {
        return 20 /* McApiPacketType.OnEntityVisibilityUpdated */;
    }
    get Id() {
        return this._id;
    }
    get Id2() {
        return this._id2;
    }
    get Value() {
        return this._value;
    }
    _id;
    _id2;
    _value;
    Serialize(writer) {
        writer.PutInt(this.Id);
        writer.PutInt(this._id2);
        writer.PutBool(this._value);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._id2 = reader.GetInt();
        this._value = reader.GetBool();
    }
    Set(id = 0, id2 = 0, value = false) {
        this._id = id;
        this._id2 = id2;
        this._value = value;
        return this;
    }
}
