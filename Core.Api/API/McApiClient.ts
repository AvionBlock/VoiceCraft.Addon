import {McApiConnectionState, McApiPacketType} from "./Data/Enums";
import {IMcApiPacket} from "./Network/McApiPackets/IMcApiPacket";
import {Event} from "./Event";
import {NetDataReader} from "./Data/NetDataReader";
import {McApiAcceptResponsePacket} from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import {McApiDenyResponsePacket} from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import {McApiPingResponsePacket} from "./Network/McApiPackets/Response/McApiPingResponsePacket";
import {McApiResetResponsePacket} from "./Network/McApiPackets/Response/McApiResetResponsePacket";
import {McApiCreateEntityResponsePacket} from "./Network/McApiPackets/Response/McApiCreateEntityResponsePacket";
import {McApiDestroyEntityResponsePacket} from "./Network/McApiPackets/Response/McApiDestroyEntityResponsePacket";
import {McApiOnEffectUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEffectUpdatedPacket";
import {McApiOnEntityCreatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityCreatedPacket";
import {McApiOnNetworkEntityCreatedPacket} from "./Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import {McApiOnEntityDestroyedPacket} from "./Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";
import {McApiOnEntityVisibilityUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityVisibilityUpdated";
import {McApiOnEntityWorldIdUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityWorldIdUpdated";
import {McApiOnEntityNameUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityNameUpdated";
import {McApiOnEntityMuteUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityMuteUpdated";
import {McApiOnEntityDeafenUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityDeafenUpdated";
import {McApiOnEntityServerMuteUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityServerMuteUpdated";
import {McApiOnEntityServerDeafenUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityServerDeafenUpdated";
import {McApiOnEntityTalkBitmaskUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityTalkBitmaskUpdated";
import {McApiOnEntityListenBitmaskUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityListenBitmaskUpdated";
import {McApiOnEntityEffectBitmaskUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityEffectBitmaskUpdated";
import {McApiOnEntityPositionUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityPositionUpdated";
import {McApiOnEntityRotationUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityRotationUpdated";
import {McApiOnEntityCaveFactorUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityCaveFactorUpdated";
import {McApiOnEntityMuffleFactorUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityMuffleFactorUpdated";
import {McApiOnEntityAudioReceivedPacket} from "./Network/McApiPackets/Event/McApiOnEntityAudioReceivedPacket";
import {Queue} from "./Data/Queue";

export abstract class McApiClient {
    private _connectionState: McApiConnectionState = McApiConnectionState.Disconnected;
    private _token: string | undefined;
    private _lastPing: number = 0;
    public OutboundQueue: Queue<Uint8Array> = new Queue<Uint8Array>();
    public InboundQueue: Queue<Uint8Array> = new Queue<Uint8Array>();

    public get Token(): string | undefined {
        return this._token;
    }

    protected set Token(value: string | undefined) {
        this._token = value;
    }

    protected get LastPing(): number {
        return this._lastPing;
    }

    protected set LastPing(value: number) {
        this._lastPing = value;
    }

    //Events
    public OnPacketReceived: Event<IMcApiPacket> = new Event<IMcApiPacket>();
    public OnConnected: Event<string> = new Event<string>();
    public OnDisconnected: Event<string> = new Event<string>();

    public get ConnectionState() {
        return this._connectionState;
    }

    protected set ConnectionState(value: McApiConnectionState) {
        this._connectionState = value;
    }

    public abstract ConnectAsync(ip: string, port: number, loginToken: string): Promise<void>;

    public abstract Update(): void;

    public abstract DisconnectAsync(reason: string | undefined): Promise<void>;

    public abstract SendPacket(packet: IMcApiPacket): boolean;

    protected ProcessPacket(reader: NetDataReader, onParsed: (packet: IMcApiPacket) => void) {
        const packetType = reader.GetByte() as McApiPacketType;
        switch (packetType) {
            case McApiPacketType.AcceptResponse:
                this.ProcessPacketType<McApiAcceptResponsePacket>(reader, onParsed, () => new McApiAcceptResponsePacket());
                break;
            case McApiPacketType.DenyResponse:
                this.ProcessPacketType<McApiDenyResponsePacket>(reader, onParsed, () => new McApiDenyResponsePacket());
                break;
            case McApiPacketType.PingResponse:
                this.ProcessPacketType<McApiPingResponsePacket>(reader, onParsed, () => new McApiPingResponsePacket());
                break;
            case McApiPacketType.ResetResponse:
                this.ProcessPacketType<McApiResetResponsePacket>(reader, onParsed, () => new McApiResetResponsePacket());
                break;
            case McApiPacketType.CreateEntityResponse:
                this.ProcessPacketType<McApiCreateEntityResponsePacket>(reader, onParsed, () => new McApiCreateEntityResponsePacket());
                break;
            case McApiPacketType.DestroyEntityResponse:
                this.ProcessPacketType<McApiDestroyEntityResponsePacket>(reader, onParsed, () => new McApiDestroyEntityResponsePacket());
                break;
            case McApiPacketType.OnEffectUpdated:
                this.ProcessPacketType<McApiOnEffectUpdatedPacket>(reader, onParsed, () => new McApiOnEffectUpdatedPacket());
                break;
            case McApiPacketType.OnEntityCreated:
                this.ProcessPacketType<McApiOnEntityCreatedPacket>(reader, onParsed, () => new McApiOnEntityCreatedPacket());
                break;
            case McApiPacketType.OnNetworkEntityCreated:
                this.ProcessPacketType<McApiOnNetworkEntityCreatedPacket>(reader, onParsed, () => new McApiOnNetworkEntityCreatedPacket());
                break;
            case McApiPacketType.OnEntityDestroyed:
                this.ProcessPacketType<McApiOnEntityDestroyedPacket>(reader, onParsed, () => new McApiOnEntityDestroyedPacket());
                break;
            case McApiPacketType.OnEntityVisibilityUpdated:
                this.ProcessPacketType<McApiOnEntityVisibilityUpdatedPacket>(reader, onParsed, () => new McApiOnEntityVisibilityUpdatedPacket());
                break;
            case McApiPacketType.OnEntityWorldIdUpdated:
                this.ProcessPacketType<McApiOnEntityWorldIdUpdatedPacket>(reader, onParsed, () => new McApiOnEntityWorldIdUpdatedPacket());
                break;
            case McApiPacketType.OnEntityNameUpdated:
                this.ProcessPacketType<McApiOnEntityNameUpdatedPacket>(reader, onParsed, () => new McApiOnEntityNameUpdatedPacket());
                break;
            case McApiPacketType.OnEntityMuteUpdated:
                this.ProcessPacketType<McApiOnEntityMuteUpdatedPacket>(reader, onParsed, () => new McApiOnEntityMuteUpdatedPacket());
                break;
            case McApiPacketType.OnEntityDeafenUpdated:
                this.ProcessPacketType<McApiOnEntityDeafenUpdatedPacket>(reader, onParsed, () => new McApiOnEntityDeafenUpdatedPacket());
                break;
            case McApiPacketType.OnEntityServerMuteUpdated:
                this.ProcessPacketType<McApiOnEntityServerMuteUpdatedPacket>(reader, onParsed, () => new McApiOnEntityServerMuteUpdatedPacket());
                break;
            case McApiPacketType.OnEntityServerDeafenUpdated:
                this.ProcessPacketType<McApiOnEntityServerDeafenUpdatedPacket>(reader, onParsed, () => new McApiOnEntityServerDeafenUpdatedPacket());
                break;
            case McApiPacketType.OnEntityTalkBitmaskUpdated:
                this.ProcessPacketType<McApiOnEntityTalkBitmaskUpdatedPacket>(reader, onParsed, () => new McApiOnEntityTalkBitmaskUpdatedPacket());
                break;
            case McApiPacketType.OnEntityListenBitmaskUpdated:
                this.ProcessPacketType<McApiOnEntityListenBitmaskUpdatedPacket>(reader, onParsed, () => new McApiOnEntityListenBitmaskUpdatedPacket());
                break;
            case McApiPacketType.OnEntityEffectBitmaskUpdated:
                this.ProcessPacketType<McApiOnEntityEffectBitmaskUpdatedPacket>(reader, onParsed, () => new McApiOnEntityEffectBitmaskUpdatedPacket());
                break;
            case McApiPacketType.OnEntityPositionUpdated:
                this.ProcessPacketType<McApiOnEntityPositionUpdatedPacket>(reader, onParsed, () => new McApiOnEntityPositionUpdatedPacket());
                break;
            case McApiPacketType.OnEntityRotationUpdated:
                this.ProcessPacketType<McApiOnEntityRotationUpdatedPacket>(reader, onParsed, () => new McApiOnEntityRotationUpdatedPacket());
                break;
            case McApiPacketType.OnEntityCaveFactorUpdated:
                this.ProcessPacketType<McApiOnEntityCaveFactorUpdatedPacket>(reader, onParsed, () => new McApiOnEntityCaveFactorUpdatedPacket());
                break;
            case McApiPacketType.OnEntityMuffleFactorUpdated:
                this.ProcessPacketType<McApiOnEntityMuffleFactorUpdatedPacket>(reader, onParsed, () => new McApiOnEntityMuffleFactorUpdatedPacket());
                break;
            case McApiPacketType.OnEntityAudioReceived:
                this.ProcessPacketType<McApiOnEntityAudioReceivedPacket>(reader, onParsed, () => new McApiOnEntityAudioReceivedPacket());
                break;
            default:
                return;
        }
    }


    protected ExecutePacket(packet: IMcApiPacket): void {
        switch (packet.constructor) {
            case McApiDenyResponsePacket:
                this.HandleDenyResponsePacket(packet as McApiDenyResponsePacket);
                break;
        }
    }

    protected AuthorizePacket(packet: IMcApiPacket, token: string) {
        switch (packet.constructor) {
            case McApiAcceptResponsePacket:
            case McApiDenyResponsePacket:
                return true;
            default:
                return this.ConnectionState === McApiConnectionState.Connected && token === this.Token
        }
    }

    private ProcessPacketType<T extends IMcApiPacket>(
        reader: NetDataReader,
        onParsed: (packet: IMcApiPacket) => void,
        packetFactory: () => T) {
        const packet = packetFactory();

        packet.Deserialize(reader);
        this.OnPacketReceived?.Invoke(packet);
        onParsed(packet);
    }

    private HandleDenyResponsePacket(packet: McApiDenyResponsePacket): void {
        if (this.ConnectionState !== McApiConnectionState.Connecting) return;
        this.DisconnectAsync(packet.Reason).then();
    }
}