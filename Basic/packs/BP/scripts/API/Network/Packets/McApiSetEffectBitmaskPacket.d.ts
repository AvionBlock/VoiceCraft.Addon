import { McApiPacket } from "./McApiPacket";
import { McApiPacketType } from "../../Data/Enums";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
export declare class McApiSetEffectBitmaskPacket extends McApiPacket {
    constructor(id?: number, value?: number);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): number;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
