import {EventType, PositioningType} from "../../../Data/Enums";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {Guid} from "../../../Data/Guid";
import {McApiOnEntityCreatedPacket} from "./McApiOnEntityCreatedPacket";
import {MaxStringLength} from "../../../Data/Constants";

export class McApiOnNetworkEntityCreatedPacket extends McApiOnEntityCreatedPacket {
    constructor(
        id: number = 0,
        loudness: number = 0.0,
        lastSpoke: bigint = 0n,
        userGuid: Guid = Guid.CreateEmpty(),
        serverUserGuid: Guid = Guid.CreateEmpty(),
        locale: string = "",
        positioningType: PositioningType = PositioningType.Server) {
        super(id, loudness, lastSpoke);
        this._userGuid = userGuid;
        this._serverUserGuid = serverUserGuid;
        this._locale = locale;
        this._positioningType = positioningType;
    }

    public override get EventType(): EventType {
        return EventType.OnNetworkEntityCreated;
    }

    public get UserGuid(): Guid {
        return this._userGuid;
    }

    public get ServerUserGuid(): Guid {
        return this._serverUserGuid;
    }

    public get Locale(): string {
        return this._locale;
    }

    public get PositioningType(): PositioningType {
        return this._positioningType;
    }

    private _userGuid: Guid;
    private _serverUserGuid: Guid;
    private _locale: string;
    private _positioningType: PositioningType;

    public override Serialize(writer: NetDataWriter): void {
        super.Serialize(writer);
        writer.PutString(this._userGuid.toString(), MaxStringLength);
        writer.PutString(this._serverUserGuid.toString(), MaxStringLength);
        writer.PutString(this._locale, MaxStringLength);
        writer.PutByte(this._positioningType);
    }

    public override Deserialize(reader: NetDataReader): void {
        super.Deserialize(reader);
        this._userGuid = Guid.Parse(reader.GetString(MaxStringLength));
        this._serverUserGuid = Guid.Parse(reader.GetString(MaxStringLength));
        this._locale = reader.GetString(MaxStringLength);
        this._positioningType = reader.GetByte() as PositioningType;
    }

    public Set(
        id: number = 0,
        loudness: number = 0.0,
        lastSpoke: bigint = 0n,
        userGuid: Guid = Guid.CreateEmpty(),
        serverUserGuid: Guid = Guid.CreateEmpty(),
        locale: string = "",
        positioningType: PositioningType = PositioningType.Server) {
        super.Set(id, loudness, lastSpoke);
        this._userGuid = userGuid;
        this._serverUserGuid = serverUserGuid;
        this._locale = locale;
        this._positioningType = positioningType;
    }
}