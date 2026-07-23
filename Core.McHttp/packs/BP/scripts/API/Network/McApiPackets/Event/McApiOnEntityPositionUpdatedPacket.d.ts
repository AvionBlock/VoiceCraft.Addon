import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
import { Vector3 } from "../../../Data/Vector3";
export declare class McApiOnEntityPositionUpdatedPacket implements IMcApiEventPacket {
    constructor(id?: number, value?: Vector3);
    get EventType(): EventType;
    get Id(): number;
    get Value(): Vector3;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: Vector3): void;
}
