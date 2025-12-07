import { MaxStringLength } from "../../Data/Constants";
import { McApiPacketType } from "../../Data/Enums";
import { Vector2 } from "../../Data/Vector2";
import { Vector3 } from "../../Data/Vector3";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";
import { McApiPacket } from "./McApiPacket";

export class McApiEntityCreatedPacket extends McApiPacket {
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
    muffleFactor: number = 0
  ) {
    super();
    this._id = id;
    this._loudness = loudness;
    this._lastSpoke = lastSpoke;
    this._worldId = worldId;
    this._name = name;
    this._muted = muted;
    this._deafened = deafened;
    this._talkBitmask = talkBitmask;
    this._listenBitmask = listenBitmask;
    this._effectBitmask = effectBitmask;
    this._position = position;
    this._rotation = rotation;
    this._caveFactor = caveFactor;
    this._muffleFactor = muffleFactor;
  }

  public override get PacketType(): McApiPacketType {
    return McApiPacketType.EntityCreated;
  }

  public get Id(): number {
    return this._id;
  }
  public get Loudness(): number {
    return this._loudness;
  }
  public get LastSpoke(): bigint {
    return this._lastSpoke;
  }
  public get WorldId(): string {
    return this._worldId;
  }
  public get Name(): string {
    return this._name;
  }
  public get Muted(): boolean {
    return this._muted;
  }
  public get Deafened(): boolean {
    return this._deafened;
  }
  public get TalkBitmask(): number {
    return this._talkBitmask;
  }
  public get ListenBitmask(): number {
    return this._listenBitmask;
  }
  public get EffectBitmask(): number {
    return this._effectBitmask;
  }
  public get Position(): Vector3 {
    return this._position;
  }
  public get Rotation(): Vector2 {
    return this._rotation;
  }
  public get CaveFactor(): number {
    return this._caveFactor;
  }
  public get MuffleFactor(): number {
    return this._muffleFactor;
  }

  private _id: number;
  private _loudness: number;
  private _lastSpoke: bigint;
  private _worldId: string;
  private _name: string;
  private _muted: boolean;
  private _deafened: boolean;
  private _talkBitmask: number;
  private _listenBitmask: number;
  private _effectBitmask: number;
  private _position: Vector3;
  private _rotation: Vector2;
  private _caveFactor: number;
  private _muffleFactor: number;

  public override Serialize(writer: NetDataWriter) {
    writer.PutInt(this.Id);
    writer.PutFloat(this.Loudness);
    writer.PutLong(BigInt(this.LastSpoke));
    writer.PutString(this.WorldId, MaxStringLength);
    writer.PutString(this.Name, MaxStringLength);
    writer.PutBool(this.Muted);
    writer.PutBool(this.Deafened);
    writer.PutUshort(this.TalkBitmask);
    writer.PutUshort(this.ListenBitmask);
    writer.PutUshort(this.EffectBitmask);
    writer.PutFloat(this.Position.X);
    writer.PutFloat(this.Position.Y);
    writer.PutFloat(this.Position.Z);
    writer.PutFloat(this.Rotation.X);
    writer.PutFloat(this.Rotation.Y);
    writer.PutFloat(this.CaveFactor);
    writer.PutFloat(this.MuffleFactor);
  }

  public override Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._loudness = reader.GetFloat();
    this._lastSpoke = reader.GetLong();
    this._worldId = reader.GetString();
    this._name = reader.GetString();
    this._muted = reader.GetBool();
    this._deafened = reader.GetBool();
    this._talkBitmask = reader.GetUshort();
    this._listenBitmask = reader.GetUshort();
    this._effectBitmask = reader.GetUshort();
    this._position = new Vector3(reader.GetFloat(), reader.GetFloat(), reader.GetFloat());
    this._rotation = new Vector2(reader.GetFloat(), reader.GetFloat());
    this._caveFactor = reader.GetFloat();
    this._muffleFactor = reader.GetFloat();
  }
}
