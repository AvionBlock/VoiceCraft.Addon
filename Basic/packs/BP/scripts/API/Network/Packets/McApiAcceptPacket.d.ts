import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";
export declare class McApiAcceptPacket extends McApiPacket {
    constructor(requestId?: string, token?: string);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get Token(): string;
    private _requestId;
    private _token;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
