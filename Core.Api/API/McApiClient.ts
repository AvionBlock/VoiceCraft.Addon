import {Version} from "./Data/Version";
import {VoiceCraft} from "./VoiceCraft";
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

export abstract class McApiClient {
    private _connectionState: McApiConnectionState = McApiConnectionState.Disconnected;
    protected LastPing: number = 0;

    public Version: Version = new Version(VoiceCraft.MajorVersion, VoiceCraft.MinorVersion, VoiceCraft.PatchVersion);

    //Events
    public OnPacketReceived: Event<IMcApiPacket> = new Event<IMcApiPacket>();
    public abstract OnConnected: Event<string>;
    public abstract OnDisconnected: Event<string | undefined>;

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
        const packetType = reader.GetByte() as McApiPacketType;
        switch (packetType) {
            case McApiPacketType.AcceptResponse:
                const acceptResponsePacket = new McApiAcceptResponsePacket();
                acceptResponsePacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(acceptResponsePacket);
                onParsed(acceptResponsePacket);
                break;
            case McApiPacketType.DenyResponse:
                const denyResponsePacket = new McApiDenyResponsePacket();
                denyResponsePacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(denyResponsePacket);
                onParsed(denyResponsePacket);
                break;
            case McApiPacketType.PingResponse:
                const pingResponsePacket = new McApiPingResponsePacket();
                pingResponsePacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(pingResponsePacket);
                onParsed(pingResponsePacket);
                break;
            case McApiPacketType.ResetResponse:
                const resetResponsePacket = new McApiResetResponsePacket();
                resetResponsePacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(resetResponsePacket);
                onParsed(resetResponsePacket);
                break;
            case McApiPacketType.CreateEntityResponse:
                const createEntityResponsePacket = new McApiCreateEntityResponsePacket();
                createEntityResponsePacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(createEntityResponsePacket);
                onParsed(createEntityResponsePacket);
                break;
            case McApiPacketType.DestroyEntityResponse:
                const destroyEntityResponsePacket = new McApiDestroyEntityResponsePacket();
                destroyEntityResponsePacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(destroyEntityResponsePacket);
                onParsed(destroyEntityResponsePacket);
                break;
            case McApiPacketType.OnEffectUpdated:
                const onEffectUpdatedPacket = new McApiOnEffectUpdatedPacket();
                onEffectUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEffectUpdatedPacket);
                onParsed(onEffectUpdatedPacket);
                break;
            case McApiPacketType.OnEntityCreated:
                const onEntityCreatedPacket = new McApiOnEntityCreatedPacket();
                onEntityCreatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityCreatedPacket);
                onParsed(onEntityCreatedPacket);
                break;
            case McApiPacketType.OnNetworkEntityCreated:
                const onNetworkEntityCreatedPacket = new McApiOnNetworkEntityCreatedPacket();
                onNetworkEntityCreatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onNetworkEntityCreatedPacket);
                onParsed(onNetworkEntityCreatedPacket);
                break;
            case McApiPacketType.OnEntityDestroyed:
                const onEntityDestroyedPacket = new McApiOnEntityDestroyedPacket();
                onEntityDestroyedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityDestroyedPacket);
                onParsed(onEntityDestroyedPacket);
                break;
            case McApiPacketType.OnEntityVisibilityUpdated:
                const onEntityVisibilityUpdatedPacket = new McApiOnEntityVisibilityUpdatedPacket();
                onEntityVisibilityUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityVisibilityUpdatedPacket);
                onParsed(onEntityVisibilityUpdatedPacket);
                break;
            case McApiPacketType.OnEntityWorldIdUpdated:
                const onEntityWorldIdUpdatedPacket = new McApiOnEntityWorldIdUpdatedPacket();
                onEntityWorldIdUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityWorldIdUpdatedPacket);
                onParsed(onEntityWorldIdUpdatedPacket);
                break;
            case McApiPacketType.OnEntityNameUpdated:
                const onEntityNameUpdatedPacket = new McApiOnEntityNameUpdatedPacket();
                onEntityNameUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityNameUpdatedPacket);
                onParsed(onEntityNameUpdatedPacket);
                break;
            case McApiPacketType.OnEntityMuteUpdated:
                const onEntityMuteUpdatedPacket = new McApiOnEntityMuteUpdatedPacket();
                onEntityMuteUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityMuteUpdatedPacket);
                onParsed(onEntityMuteUpdatedPacket);
                break;
            case McApiPacketType.OnEntityDeafenUpdated:
                const onEntityDeafenUpdatedPacket = new McApiOnEntityDeafenUpdatedPacket();
                onEntityDeafenUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityDeafenUpdatedPacket);
                onParsed(onEntityDeafenUpdatedPacket);
                break;
            case McApiPacketType.OnEntityServerMuteUpdated:
                const onEntityServerMuteUpdatedPacket = new McApiOnEntityServerMuteUpdatedPacket();
                onEntityServerMuteUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityServerMuteUpdatedPacket);
                onParsed(onEntityServerMuteUpdatedPacket);
                break;
            case McApiPacketType.OnEntityServerDeafenUpdated:
                const onEntityServerDeafenUpdatedPacket = new McApiOnEntityServerDeafenUpdatedPacket();
                onEntityServerDeafenUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityServerDeafenUpdatedPacket);
                onParsed(onEntityServerDeafenUpdatedPacket);
                break;
            case McApiPacketType.OnEntityTalkBitmaskUpdated:
                const onEntityTalkBitmaskUpdatedPacket = new McApiOnEntityTalkBitmaskUpdatedPacket();
                onEntityTalkBitmaskUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityTalkBitmaskUpdatedPacket);
                onParsed(onEntityTalkBitmaskUpdatedPacket);
                break;
            case McApiPacketType.OnEntityListenBitmaskUpdated:
                const onEntityListenBitmaskUpdatedPacket = new McApiOnEntityListenBitmaskUpdatedPacket();
                onEntityListenBitmaskUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityListenBitmaskUpdatedPacket);
                onParsed(onEntityListenBitmaskUpdatedPacket);
                break;
            case McApiPacketType.OnEntityEffectBitmaskUpdated:
                const onEntityEffectBitmaskUpdatedPacket = new McApiOnEntityEffectBitmaskUpdatedPacket();
                onEntityEffectBitmaskUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityEffectBitmaskUpdatedPacket);
                onParsed(onEntityEffectBitmaskUpdatedPacket);
                break;
            case McApiPacketType.OnEntityPositionUpdated:
                const onEntityPositionUpdatedPacket = new McApiOnEntityPositionUpdatedPacket();
                onEntityPositionUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityPositionUpdatedPacket);
                onParsed(onEntityPositionUpdatedPacket);
                break;
            case McApiPacketType.OnEntityRotationUpdated:
                const onEntityRotationUpdatedPacket = new McApiOnEntityRotationUpdatedPacket();
                onEntityRotationUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityRotationUpdatedPacket);
                onParsed(onEntityRotationUpdatedPacket);
                break;
            case McApiPacketType.OnEntityCaveFactorUpdated:
                const onEntityCaveFactorUpdatedPacket = new McApiOnEntityCaveFactorUpdatedPacket();
                onEntityCaveFactorUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityCaveFactorUpdatedPacket);
                onParsed(onEntityCaveFactorUpdatedPacket);
                break;
            case McApiPacketType.OnEntityMuffleFactorUpdated:
                const onEntityMuffleFactorUpdatedPacket = new McApiOnEntityMuffleFactorUpdatedPacket();
                onEntityMuffleFactorUpdatedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityMuffleFactorUpdatedPacket);
                onParsed(onEntityMuffleFactorUpdatedPacket);
                break;
            case McApiPacketType.OnEntityAudioReceived:
                const onEntityAudioReceivedPacket = new McApiOnEntityAudioReceivedPacket();
                onEntityAudioReceivedPacket.Deserialize(reader);
                this.OnPacketReceived.Invoke(onEntityAudioReceivedPacket);
                onParsed(onEntityAudioReceivedPacket);
                break;
        }
    }

    protected ExecutePacket(packet: IMcApiPacket): void {
        switch (packet.constructor) {
            case McApiDenyResponsePacket:
                this.HandleDenyResponsePacket(packet as McApiDenyResponsePacket);
                break;
            case McApiPingResponsePacket:
                this.HandlePingResponsePacket(packet as McApiPingResponsePacket);
                break;
        }
    }

    private HandleDenyResponsePacket(packet: McApiDenyResponsePacket): void {
        this.DisconnectAsync(packet.Reason, true).then();
    }

    private HandlePingResponsePacket(_: McApiPingResponsePacket): void {
        this.LastPing = Date.now();
    }
}