import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
export declare class McApiOnEntityDestroyedPacket implements IMcApiPacket {
    constructor(id?: number);
    get PacketType(): McApiPacketType;
    get Id(): number;
    private _id;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
