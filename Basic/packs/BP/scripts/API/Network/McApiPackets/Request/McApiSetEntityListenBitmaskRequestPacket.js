export class McApiSetEntityListenBitmaskRequestPacket {
    constructor(id = 0, value = 0) {
        this._id = id;
        this._value = value;
    }
    get PacketType() {
        return 10 /* McApiPacketType.SetEntityListenBitmaskRequest */;
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
        writer.PutUshort(this._value);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
        this._value = reader.GetUshort();
    }
    Set(id = 0, value = 0) {
        this._id = id;
        this._value = value;
        return this;
    }
}
