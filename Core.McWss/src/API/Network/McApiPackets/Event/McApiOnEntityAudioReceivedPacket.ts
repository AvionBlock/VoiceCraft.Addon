import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";

export class McApiOnEntityAudioReceivedPacket implements IMcApiPacket {
  constructor(
    id: number = 0,
    timestamp: number = 0,
    loudness: number = 0.0
  ) {
    this._id = id;
    this._timestamp = timestamp;
    this._frameLoudness = loudness;
  }

  public get PacketType(): McApiPacketType {
    return McApiPacketType.OnEntityAudioReceived;
  }
  public get Id(): number {
    return this._id;
  }
  public get Timestamp(): number {
    return this._timestamp;
  }
  public get FrameLoudness(): number {
    return this._frameLoudness;
  }

  private _id: number;
  private _timestamp: number;
  private _frameLoudness: number;

  public Serialize(writer: NetDataWriter) {
    writer.PutInt(this._id);
    writer.PutUshort(this._timestamp);
    writer.PutFloat(this._frameLoudness);
  }

  public Deserialize(reader: NetDataReader) {
    this._id = reader.GetInt();
    this._timestamp = reader.GetUshort();
    this._frameLoudness = reader.GetFloat();
  }

  public Set(
    id: number = 0,
    timestamp: number = 0,
    loudness: number = 0.0
  ): McApiOnEntityAudioReceivedPacket {
    this._id = id;
    this._timestamp = timestamp;
    this._frameLoudness = loudness;
    return this;
  }
}
