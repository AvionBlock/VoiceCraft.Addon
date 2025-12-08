import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
export declare class McApiDenyResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId?: string, token?: string, reason?: string);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get Token(): string;
    get Reason(): string;
    private _requestId;
    private _token;
    private _reason;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(requestId?: string, token?: string, reason?: string): McApiDenyResponsePacket;
}
