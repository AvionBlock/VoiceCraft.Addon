import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
export declare class McApiOnEntityMuffleFactorUpdatedPacket implements IMcApiPacket {
    constructor(id?: number, value?: number);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): number;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: number): McApiOnEntityMuffleFactorUpdatedPacket;
}
