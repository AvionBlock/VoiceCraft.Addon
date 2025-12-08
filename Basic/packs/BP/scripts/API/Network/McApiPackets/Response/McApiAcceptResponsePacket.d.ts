import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
export declare class McApiAcceptResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId?: string, token?: string);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get Token(): string;
    private _requestId;
    private _token;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(requestId?: string, token?: string): McApiAcceptResponsePacket;
}
