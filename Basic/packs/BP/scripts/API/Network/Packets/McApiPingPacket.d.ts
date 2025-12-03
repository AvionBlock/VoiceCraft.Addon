import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";
export declare class McApiPingPacket extends McApiPacket {
    constructor(token?: string);
    get PacketType(): McApiPacketType;
    get Token(): string;
    private _token;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
