import { McApiPacketType } from "../../../Data/Enums";
import { NetDataReader } from "../../../Data/NetDataReader";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { IMcApiPacket } from "../IMcApiPacket";
export declare class McApiOnEntityVisibilityUpdatedPacket implements IMcApiPacket {
    constructor(id?: number, id2?: number, value?: boolean);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Id2(): number;
    get Value(): boolean;
    private _id;
    private _id2;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, id2?: number, value?: boolean): McApiOnEntityVisibilityUpdatedPacket;
}
