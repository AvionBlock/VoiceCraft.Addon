import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
export declare class McApiSetEntityCaveFactorRequestPacket implements IMcApiPacket {
    constructor(id?: number, value?: number);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): number;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: number): McApiSetEntityCaveFactorRequestPacket;
}
