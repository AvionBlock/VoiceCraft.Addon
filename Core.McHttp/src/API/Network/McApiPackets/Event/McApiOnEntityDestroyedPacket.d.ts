import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../../Data/NetDataReader";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
export declare class McApiOnEntityDestroyedPacket implements IMcApiPacket {
    constructor(id?: number);
    get PacketType(): McApiPacketType;
    get Id(): number;
    private _id;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number): McApiOnEntityDestroyedPacket;
}
