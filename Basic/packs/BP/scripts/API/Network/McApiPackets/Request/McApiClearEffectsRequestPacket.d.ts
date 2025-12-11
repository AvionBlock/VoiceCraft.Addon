import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
export declare class McApiClearEffectsRequestPacket implements IMcApiPacket {
    constructor(token?: string);
    get PacketType(): McApiPacketType;
    get Token(): string;
    private _token;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(token?: string): McApiClearEffectsRequestPacket;
}
