import { IMcApiEventPacket } from "../IMcApiEventPacket";
import { EventType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
import { Vector2 } from "../../../Data/Vector2";
export declare class McApiOnEntityRotationUpdatedPacket implements IMcApiEventPacket {
    constructor(id?: number, value?: Vector2);
    get EventType(): EventType;
    get Id(): number;
    get Value(): Vector2;
    private _id;
    private _value;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
    Set(id?: number, value?: Vector2): void;
}
