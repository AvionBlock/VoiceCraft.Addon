export class McApiOnEntityDestroyedPacket {
    constructor(id = 0) {
        this._id = id;
    }
    get PacketType() {
        return 22 /* McApiPacketType.OnEntityDestroyed */;
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
    Set(id = 0) {
        this._id = id;
        return this;
    }
}
