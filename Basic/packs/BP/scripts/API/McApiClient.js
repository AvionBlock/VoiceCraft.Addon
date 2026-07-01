import { VoiceCraft } from "./VoiceCraft";
import { McApiConnectionState } from "./Data/Enums";
import { Event } from "./Event";
import { McApiAcceptResponsePacket } from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import { McApiDenyResponsePacket } from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import { system } from "@minecraft/server";
export class McApiClient {
    _voicecraft = new VoiceCraft();
    _connectionState = McApiConnectionState.Disconnected;
    _token;
    LastPing = 0;
    get Token() {
        return this._token;
    }
    set Token(value) {
        this._token = value;
    }
    //Events
    OnConnected = new Event();
    OnDisconnected = new Event();
    get ConnectionState() {
        return this._connectionState;
    }
    set ConnectionState(value) {
        this._connectionState = value;
    }
    ProcessPacket(reader, onParsed) {
        this._voicecraft.HandlePacket(reader, onParsed);
    }
    ExecutePacket(packet) {
        switch (packet.constructor) {
            case McApiAcceptResponsePacket:
                this.HandleAcceptResponsePacket(packet);
                break;
            case McApiDenyResponsePacket:
                this.HandleDenyResponsePacket(packet);
                break;
        }
    }
    HandleAcceptResponsePacket(packet) {
        if (this.ConnectionState != McApiConnectionState.Connecting)
            return;
        this._token = packet.Token;
        this._connectionState = McApiConnectionState.Connected;
        this.OnConnected?.Invoke(packet.Token);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onConnected`, packet.Token);
    }
    HandleDenyResponsePacket(packet) {
        if (this.ConnectionState != McApiConnectionState.Connecting)
            return;
        this.DisconnectAsync(packet.Reason, true).then();
    }
}
