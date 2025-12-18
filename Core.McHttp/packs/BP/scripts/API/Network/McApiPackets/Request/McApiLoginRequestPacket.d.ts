import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
import { Version } from "../../../Data/Version";
export declare class McApiLoginRequestPacket implements IMcApiPacket, IMcApiRIdPacket {
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
    Set(requestId?: string, token?: string, version?: Version): McApiLoginRequestPacket;
}
