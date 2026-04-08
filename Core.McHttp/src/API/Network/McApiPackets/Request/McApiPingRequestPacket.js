import { McApiPacketType } from "../../../Data/Enums";
export class McApiPingRequestPacket {
    constructor() {
    }
    get PacketType() {
        return McApiPacketType.PingRequest;
    }
    Serialize(writer) {
    }
    Deserialize(reader) {
    }
    Set() {
        return this;
    }
}
