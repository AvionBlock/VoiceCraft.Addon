import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
export declare class McApiSetEntityWorldIdRequestPacket implements IMcApiPacket {
    constructor(token?: string, id?: number, value?: string);
    get PacketType(): McApiPacketType;
    get Token(): string;
    get Id(): number;
    get Value(): string;
    private _token;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(token?: string, id?: number, value?: string): McApiSetEntityWorldIdRequestPacket;
}
