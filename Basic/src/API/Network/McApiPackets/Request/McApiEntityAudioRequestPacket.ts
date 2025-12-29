import { McApiPacketType } from "../../../Data/Enums";
import { IMcApiPacket } from "../IMcApiPacket";
import { NetDataWriter } from "../../NetDataWriter";
import { NetDataReader } from "../../NetDataReader";
import {MaximumEncodedBytes} from "../../../Data/Constants";

export class McApiEntityAudioRequestPacket implements IMcApiPacket {
    constructor(
        id: number = 0,
        timestamp: number = 0,
        loudness: number = 0.0,
        length: number = 0,
        data: Uint8Array = new Uint8Array(0),
    ) {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        this._length = length;
        this._data = data;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.EntityAudioRequest;
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
    public get Length(): number {
        return this._length;
    }
    public get Data(): Uint8Array {
        return this._data;
    }

    private _id: number;
    private _timestamp: number;
    private _frameLoudness: number;
    private _length: number;
    private _data: Uint8Array;

    public Serialize(writer: NetDataWriter) {
        writer.PutInt(this.Id);
        writer.PutUshort(this.Timestamp);
        writer.PutFloat(this.FrameLoudness);
        writer.PutBytes(this.Data, 0, this.Length);
    }

    public Deserialize(reader: NetDataReader) {
        this._id = reader.GetInt();
        this._timestamp = reader.GetUshort();
        this._frameLoudness = reader.GetFloat();
        this._length = reader.AvailableBytes;
        if(this._length > MaximumEncodedBytes)
            throw new Error(`Array length exceeds maximum number of bytes per packet! Got ${this._length} bytes.`);
        this._data = new Uint8Array(this._length);
        reader.GetBytes(this._data, this._length);
    }

    public Set(
        id: number = 0,
        timestamp: number = 0,
        loudness: number = 0.0,
        length: number = 0,
        data: Uint8Array = new Uint8Array(0)
    ): McApiEntityAudioRequestPacket {
        this._id = id;
        this._timestamp = timestamp;
        this._frameLoudness = loudness;
        this._length = length;
        this._data = data;
        return this;
    }
}
