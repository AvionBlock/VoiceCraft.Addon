export class McApiOnEntityDeafenUpdatedPacket {
    constructor(id = 0, value = false) {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 27 /* McApiPacketType.OnEntityDeafenUpdated */;
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
        writer.PutBool(this._value);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetBool();
    }
    Set(id = 0, value = false) {
        this._id = id;
        this._value = value;
        return this;
    }
}
