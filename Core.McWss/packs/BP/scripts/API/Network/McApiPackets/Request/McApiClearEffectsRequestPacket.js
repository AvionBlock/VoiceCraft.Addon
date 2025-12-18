import { McApiPacketType } from "../../../Data/Enums";
export class McApiClearEffectsRequestPacket {
    constructor() {
    }
    get PacketType() {
        return McApiPacketType.ClearEffectsRequest;
    }
    Serialize(writer) {
    }
    Deserialize(reader) {
    }
    Set() {
        return this;
    }
}
