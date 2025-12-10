import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
export declare class McApiOnEntityNameUpdatedPacket implements IMcApiPacket {
    constructor(id?: number, value?: string);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): string;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: string): McApiOnEntityNameUpdatedPacket;
}
