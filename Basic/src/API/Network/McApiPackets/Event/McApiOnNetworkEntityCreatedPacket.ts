import { MaxStringLength } from "../../../Data/Constants";
import { McApiPacketType, PositioningType } from "../../../Data/Enums";
import { Guid } from "../../../Data/Guid";
import { Vector2 } from "../../../Data/Vector2";
import { Vector3 } from "../../../Data/Vector3";
import { NetDataReader } from "../../NetDataReader";
import { NetDataWriter } from "../../NetDataWriter";
import { McApiOnEntityCreatedPacket } from "./McApiOnEntityCreatedPacket";

export class McApiOnNetworkEntityCreatedPacket extends McApiOnEntityCreatedPacket {
  constructor(
    id: number = 0,
    loudness: number = 0,
    lastSpoke: bigint = 0n,
    worldId: string = "",
    name: string = "",
    muted: boolean = false,
    deafened: boolean = false,
    talkBitmask: number = 0,
    listenBitmask: number = 0,
    effectBitmask: number = 0,
    position: Vector3 = new Vector3(),
    rotation: Vector2 = new Vector2(),
    caveFactor: number = 0,
    muffleFactor: number = 0,
    userGuid: Guid = Guid.CreateEmpty(),
    serverUserGuid: Guid = Guid.CreateEmpty(),
    locale: string = "",
    positioningType: PositioningType = PositioningType.Server
  ) {
    super(
      id,
      loudness,
      lastSpoke,
      worldId,
      name,
      muted,
      deafened,
      talkBitmask,
      listenBitmask,
      effectBitmask,
      position,
      rotation,
      caveFactor,
      muffleFactor
    );
    this._userGuid = userGuid;
    this._serverUserGuid = serverUserGuid;
    this._locale = locale;
    this._positioningType = positioningType;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.OnNetworkEntityCreated;
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

  public override Serialize(writer: NetDataWriter) {
    super.Serialize(writer);
    writer.PutString(this._userGuid.toString(), MaxStringLength);
    writer.PutString(this._serverUserGuid.toString(), MaxStringLength);
    writer.PutString(this._locale, MaxStringLength);
    writer.PutByte(this._positioningType);
  }

  public override Deserialize(reader: NetDataReader) {
    super.Deserialize(reader);
    this._userGuid = Guid.Parse(reader.GetString(MaxStringLength));
    this._serverUserGuid = Guid.Parse(reader.GetString(MaxStringLength));
    this._locale = reader.GetString(MaxStringLength);
    this._positioningType = reader.GetByte() as PositioningType;
  }
}
