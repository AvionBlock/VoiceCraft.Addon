import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
export declare class McApiSetEntityCaveFactorRequestPacket implements IMcApiPacket {
    constructor(token?: string, id?: number, value?: number);
    get PacketType(): McApiPacketType;
    get Token(): string;
    get Id(): number;
    get Value(): number;
    private _token;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(token?: string, id?: number, value?: number): McApiSetEntityCaveFactorRequestPacket;
}
