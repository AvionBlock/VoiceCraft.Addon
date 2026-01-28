import { Version } from "./Data/Version";
import { McApiConnectionState } from "./Data/Enums";
import { IMcApiPacket } from "./Network/McApiPackets/IMcApiPacket";
import { Event } from "./Event";
import { NetDataReader } from "./Data/NetDataReader";
export declare abstract class McApiClient {
    private _connectionState;
    private _token;
    protected LastPing: number;
    Version: Version;
    get Token(): string | undefined;
    protected set Token(value: string | undefined);
    OnPacketReceived: Event<IMcApiPacket>;
    OnConnected: Event<string>;
    OnDisconnected: Event<string | undefined>;
    get ConnectionState(): McApiConnectionState;
    protected set ConnectionState(value: McApiConnectionState);
    abstract ConnectAsync(ip: string, port: number, loginToken: string): Promise<void>;
    abstract DisconnectAsync(reason: string | undefined, force: boolean): Promise<void>;
    abstract SendPacket(packet: IMcApiPacket): boolean;
    protected ProcessPacket(reader: NetDataReader, onParsed: (packet: IMcApiPacket) => void): void;
    protected ExecutePacket(packet: IMcApiPacket): void;
    private HandleAcceptResponsePacket;
    private HandleDenyResponsePacket;
}
