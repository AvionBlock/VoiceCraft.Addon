import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
export declare class McApiClearEffectsRequestPacket implements IMcApiPacket {
    constructor();
    get PacketType(): McApiPacketType;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(): McApiClearEffectsRequestPacket;
}
