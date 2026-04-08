import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";

export class McApiClearEffectsRequestPacket implements IMcApiPacket {
    constructor() {
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.ClearEffectsRequest;
    }

    public Serialize(writer: NetDataWriter) {
    }

    public Deserialize(reader: NetDataReader) {
    }

    public Set(): McApiClearEffectsRequestPacket {
        return this;
    }
}
