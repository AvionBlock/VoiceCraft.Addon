import { McApiPacketType } from "../../Data/Enums";
import { Version } from "../../Data/Version";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";
export declare class McApiLoginPacket extends McApiPacket {
    constructor(loginToken?: string, version?: Version);
    get PacketType(): McApiPacketType;
    get LoginToken(): string;
    get Version(): Version;
    private _loginToken;
    private _version;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
