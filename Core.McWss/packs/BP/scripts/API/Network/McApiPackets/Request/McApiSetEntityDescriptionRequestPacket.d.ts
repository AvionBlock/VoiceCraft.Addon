import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
export declare class McApiSetEntityDescriptionRequestPacket implements IMcApiPacket {
    constructor(id?: number, value?: string);
    get PacketType(): McApiPacketType;
    get Id(): number;
    get Value(): string;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: string): McApiSetEntityDescriptionRequestPacket;
}
