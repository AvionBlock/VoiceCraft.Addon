import { McApiPacketType, PositioningType } from "../../Data/Enums";
import { Guid } from "../../Data/Guid";
import { Vector2 } from "../../Data/Vector2";
import { Vector3 } from "../../Data/Vector3";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiEntityCreatedPacket } from "./McApiEntityCreatedPacket";
export declare class McApiNetworkEntityCreatedPacket extends McApiEntityCreatedPacket {
    constructor(id?: number, loudness?: number, lastSpoke?: bigint, worldId?: string, name?: string, muted?: boolean, deafened?: boolean, talkBitmask?: number, listenBitmask?: number, effectBitmask?: number, position?: Vector3, rotation?: Vector2, caveFactor?: number, muffleFactor?: number, userGuid?: Guid, serverUserGuid?: Guid, locale?: string, positioningType?: PositioningType);
    get PacketType(): McApiPacketType;
    get UserGuid(): Guid;
    get ServerUserGuid(): Guid;
    get Locale(): string;
    get PositioningType(): PositioningType;
    private _userGuid;
    private _serverUserGuid;
    private _locale;
    private _positioningType;
    Serialize(writer: NetDataWriter): void;
    Deserialize(reader: NetDataReader): void;
}
