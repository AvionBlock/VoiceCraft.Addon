import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";
export declare class McApiDenyPacket extends McApiPacket {
    constructor(requestId?: string, token?: string, reasonKey?: string);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get Token(): string;
    get ReasonKey(): string;
    private _requestId;
    private _token;
    private _reasonKey;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
