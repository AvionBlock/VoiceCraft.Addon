import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
export declare class McApiSetNamePacket extends McApiPacket {
    constructor(id?: number, value?: string);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): string;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
