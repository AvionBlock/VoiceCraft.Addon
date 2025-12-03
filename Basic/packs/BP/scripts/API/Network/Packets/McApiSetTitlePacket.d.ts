import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
export declare class McApiSetTitlePacket extends McApiPacket {
    constructor(value?: string);
    get PacketType(): McApiPacketType;
    get Value(): string;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
