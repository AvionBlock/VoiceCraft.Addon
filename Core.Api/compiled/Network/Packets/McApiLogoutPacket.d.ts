import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";
export declare class McApiLogoutPacket extends McApiPacket {
    constructor(sessionToken?: string);
    get PacketType(): McApiPacketType;
    get SessionToken(): string;
    private _sessionToken;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
