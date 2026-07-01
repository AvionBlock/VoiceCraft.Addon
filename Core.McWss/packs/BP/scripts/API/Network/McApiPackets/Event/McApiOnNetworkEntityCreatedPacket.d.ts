import { EventType, PositioningType } from "../../../Data/Enums";
import { NetDataWriter } from "../../../Data/NetDataWriter";
import { NetDataReader } from "../../../Data/NetDataReader";
import { Guid } from "../../../Data/Guid";
import { McApiOnEntityCreatedPacket } from "./McApiOnEntityCreatedPacket";
export declare class McApiOnNetworkEntityCreatedPacket extends McApiOnEntityCreatedPacket {
    constructor(id?: number, loudness?: number, lastSpoke?: bigint, userGuid?: Guid, serverUserGuid?: Guid, locale?: string, positioningType?: PositioningType);
    get EventType(): EventType;
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
    Set(id?: number, loudness?: number, lastSpoke?: bigint, userGuid?: Guid, serverUserGuid?: Guid, locale?: string, positioningType?: PositioningType): void;
}
