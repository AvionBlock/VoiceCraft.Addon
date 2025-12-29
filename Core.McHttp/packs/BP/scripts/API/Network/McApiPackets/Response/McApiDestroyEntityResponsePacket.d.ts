import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
export declare class McApiDestroyEntityResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId?: string, responseCode?: ResponseCodes);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get ResponseCode(): ResponseCodes;
    private _requestId;
    private _responseCode;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(requestId?: string, responseCode?: ResponseCodes): McApiDestroyEntityResponsePacket;
}
export declare enum ResponseCodes {
    Ok = 0,
    NotFound = -1
}
