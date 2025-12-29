import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
export declare class McApiResetResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId?: string, responseCode?: ResponseCodes);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get ResponseCode(): ResponseCodes;
    private _requestId;
    private _responseCode;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(requestId?: string, responseCode?: ResponseCodes): McApiResetResponsePacket;
}
export declare enum ResponseCodes {
    Ok = 0,
    Failure = -1
}
