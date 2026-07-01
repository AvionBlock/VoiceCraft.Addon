import { EventType, McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
import { Version } from "../../../Data/Version";
export declare class McApiLoginRequestPacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId?: string, token?: string, version?: Version, subscribeEvents?: EventType[]);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get Token(): string;
    get Version(): Version;
    get SubscribeEvents(): EventType[];
    private _requestId;
    private _token;
    private _version;
    private _subscribeEvents;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(requestId?: string, token?: string, version?: Version, subscribeEvents?: EventType[]): void;
}
