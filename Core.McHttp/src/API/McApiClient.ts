import {VoiceCraft} from "./VoiceCraft";
import {McApiConnectionState} from "./Data/Enums";
import {IMcApiPacket} from "./Network/McApiPackets/IMcApiPacket";
import {Event} from "./Event";
import {NetDataReader} from "./Data/NetDataReader";
import {McApiAcceptResponsePacket} from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import {McApiDenyResponsePacket} from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import {system} from "@minecraft/server";

export abstract class McApiClient {
    private _voicecraft: VoiceCraft = new VoiceCraft();
    private _connectionState: McApiConnectionState = McApiConnectionState.Disconnected;
    private _token: string | undefined;
    protected LastPing: number = 0;

    public get Token(): string | undefined {
        return this._token;
    }

    protected set Token(value: string | undefined) {
        this._token = value;
    }

    //Events
    public OnConnected: Event<string> = new Event<string>();
    public OnDisconnected: Event<string | undefined> = new Event<string | undefined>();

    public get ConnectionState() {
        return this._connectionState;
    }

    protected set ConnectionState(value: McApiConnectionState) {
        this._connectionState = value;
    }

    public abstract ConnectAsync(ip: string, port: number, loginToken: string): Promise<void>;

    public abstract DisconnectAsync(reason: string | undefined, force: boolean): Promise<void>;

    public abstract SendPacket(packet: IMcApiPacket): boolean;

    protected ProcessPacket(reader: NetDataReader, onParsed: (packet: IMcApiPacket) => void) {
        this._voicecraft.HandlePacket(reader, onParsed);
    }

    protected ExecutePacket(packet: IMcApiPacket): void {
        switch (packet.constructor) {
            case McApiAcceptResponsePacket:
                this.HandleAcceptResponsePacket(packet as McApiAcceptResponsePacket);
                break;
            case McApiDenyResponsePacket:
                this.HandleDenyResponsePacket(packet as McApiDenyResponsePacket);
                break;
        }
    }

    private HandleAcceptResponsePacket(packet: McApiAcceptResponsePacket) {
        if (this.ConnectionState != McApiConnectionState.Connecting) return;
        this._token = packet.Token;
        this._connectionState = McApiConnectionState.Connected;
        this.OnConnected?.Invoke(packet.Token);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onConnected`, packet.Token);
    }

    private HandleDenyResponsePacket(packet: McApiDenyResponsePacket): void {
        if (this.ConnectionState != McApiConnectionState.Connecting) return;
        this.DisconnectAsync(packet.Reason, true).then();
    }
}