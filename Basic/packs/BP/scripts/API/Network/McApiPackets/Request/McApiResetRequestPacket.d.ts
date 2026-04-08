import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../../Data/NetDataReader";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
import { IMcApiRIdPacket } from "../IMcApiRIdPacket";
export declare class McApiResetRequestPacket implements IMcApiPacket, IMcApiRIdPacket {
    constructor(requestId?: string);
    get PacketType(): McApiPacketType;
    get RequestId(): string;
    private _requestId;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(requestId?: string): McApiResetRequestPacket;
}
