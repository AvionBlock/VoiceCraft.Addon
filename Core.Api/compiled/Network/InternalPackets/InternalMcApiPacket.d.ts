import { InternalPacketType, McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "../Packets/McApiPacket";
import { InternalPacket } from "./InternalPacket";
export declare class InternalMcApiPacket extends InternalPacket {
    constructor(requestId?: string, packet?: McApiPacket);
    get PacketType(): InternalPacketType;
    get Type(): McApiPacketType;
    get Packet(): McApiPacket | undefined;
    private _type;
    private _packet?;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
