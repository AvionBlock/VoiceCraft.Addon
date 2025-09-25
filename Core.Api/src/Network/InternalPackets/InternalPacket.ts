import { Constants } from "../../Data/Constants";
import { InternalPacketType } from "../../Data/Enums";
import { INetSerializable } from "../INetSerializable";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";

export abstract class InternalPacket implements INetSerializable {
  constructor(requestId: string) {
    this._requestId = requestId;
  }

  public get RequestId(): string {
    return this._requestId;
  }
  public abstract get PacketType(): InternalPacketType;
  private _requestId: string;

  public Serialize(writer: NetDataWriter): void {
    writer.PutString(this._requestId, Constants.MaxStringLength);
  }
  public Deserialize(reader: NetDataReader): void {
    this._requestId = reader.GetString(Constants.MaxStringLength);
  }
}
