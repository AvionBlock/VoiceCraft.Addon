import { Constants } from "../../Data/Constants";
import { InternalPacketType } from "../../Data/Enums";
import { INetSerializable } from "../INetSerializable";
import { NetDataReader } from "../NetDataReader";
import { NetDataWriter } from "../NetDataWriter";

export abstract class InternalPacket implements INetSerializable {
  constructor(requestId?: string) {
    this._requestId = requestId;
  }

  public get RequestId(): string | undefined {
    return this._requestId;
  }
  public abstract get PacketType(): InternalPacketType;
  private _requestId?: string;

  public Serialize(writer: NetDataWriter): void {
    if(this._requestId !== undefined)
      writer.PutString(this._requestId, Constants.MaxStringLength);
    else
      writer.PutString("", Constants.MaxStringLength);
  }
  public Deserialize(reader: NetDataReader): void {
    const requestId = reader.GetString(Constants.MaxStringLength);
    if(requestId.length === 0)
      this._requestId = undefined;
    else
      this._requestId = requestId;
  }
}
