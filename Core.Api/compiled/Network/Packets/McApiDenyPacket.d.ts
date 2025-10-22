import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";
export declare class McApiDenyPacket extends McApiPacket {
    constructor(reasonKey?: string);
    get PacketType(): McApiPacketType;
    get ReasonKey(): string;
    private _reasonKey;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
