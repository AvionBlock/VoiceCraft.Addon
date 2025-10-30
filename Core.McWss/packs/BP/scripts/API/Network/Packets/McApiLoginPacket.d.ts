import { McApiPacketType } from "../../Data/Enums";
import { Version } from "../../Data/Version";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";
export declare class McApiLoginPacket extends McApiPacket {
    constructor(requestId?: string, token?: string, version?: Version);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get Token(): string;
    get Version(): Version;
    private _requestId;
    private _token;
    private _version;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
