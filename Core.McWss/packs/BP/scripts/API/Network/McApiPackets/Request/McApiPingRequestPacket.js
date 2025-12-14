export class McApiPingRequestPacket {
    constructor() {
    }
    get PacketType() {
        return 2 /* McApiPacketType.PingRequest */;
    }
    Serialize(writer) {
    }
    Deserialize(reader) {
    }
    Set() {
        return this;
    }
}
