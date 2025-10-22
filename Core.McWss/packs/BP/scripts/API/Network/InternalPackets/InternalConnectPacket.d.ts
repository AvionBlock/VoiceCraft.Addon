import { InternalPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { InternalPacket } from "./InternalPacket";
export declare class InternalConnectPacket extends InternalPacket {
    constructor(requestId?: string, ip?: string, port?: number, loginToken?: string);
    get PacketType(): InternalPacketType;
    get Ip(): string;
    get Port(): number;
    get LoginToken(): string;
    private _ip;
    private _port;
    private _loginToken;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
