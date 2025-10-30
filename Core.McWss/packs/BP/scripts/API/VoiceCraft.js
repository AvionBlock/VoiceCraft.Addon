import { NetDataReader } from "./Network/NetDataReader";
import { NetDataWriter } from "./Network/NetDataWriter";
export class VoiceCraft {
    constructor() {
    }
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _requests = new Set();
}
