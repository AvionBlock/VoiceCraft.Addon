import { NetDataReader } from "./Network/NetDataReader";
import { NetDataWriter } from "./Network/NetDataWriter";

export class VoiceCraft {
  constructor() {
  }

  private _writer = new NetDataWriter();
  private _reader = new NetDataReader();
  private _requests = new Set<string>();

  //Events
  //McApi
}
