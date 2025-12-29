import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
export declare class McApiCreateEntityResponsePacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId?: string, responseCode?: ResponseCodes, id?: number);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get ResponseCode(): ResponseCodes;
    get Id(): number;
    private _requestId;
    private _responseCode;
    private _id;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(requestId?: string, responseCode?: ResponseCodes, id?: number): McApiCreateEntityResponsePacket;
}
export declare enum ResponseCodes {
    Ok = 0,
    Failure = -1
}
