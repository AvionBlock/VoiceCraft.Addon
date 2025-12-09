export class McApiOnEntityDestroyedPacket {
    constructor(id = 0) {
        this._id = id;
    }
    get PacketType() {
        return 10 /* McApiPacketType.OnEntityDestroyed */;
    }
    get Id() {
        return this._id;
    }
    _id;
    Serialize(writer) {
        writer.PutInt(this.Id);
    }
    Deserialize(reader) {
        this._id = reader.GetInt();
    }
}
