import { EventType } from "../../Data/Enums";
import { INetSerializable } from "../../Interfaces/INetSerializable";
export interface IMcApiEventPacket extends INetSerializable {
    get EventType(): EventType;
}
export declare function IsIMcApiEventPacket(object: any): object is IMcApiEventPacket;
