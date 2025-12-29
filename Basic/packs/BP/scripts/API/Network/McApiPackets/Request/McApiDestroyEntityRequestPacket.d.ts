import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
export declare class McApiDestroyEntityRequestPacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId?: string, id?: number);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    get Id(): number;
    private _requestId;
    private _id;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(requestId?: string, id?: number): McApiDestroyEntityRequestPacket;
}
