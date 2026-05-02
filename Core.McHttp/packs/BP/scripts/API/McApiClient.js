import { McApiConnectionState, McApiPacketType } from "./Data/Enums";
import { Event } from "./Event";
import { McApiAcceptResponsePacket } from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import { McApiDenyResponsePacket } from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import { McApiPingResponsePacket } from "./Network/McApiPackets/Response/McApiPingResponsePacket";
import { McApiResetResponsePacket } from "./Network/McApiPackets/Response/McApiResetResponsePacket";
import { McApiCreateEntityResponsePacket } from "./Network/McApiPackets/Response/McApiCreateEntityResponsePacket";
import { McApiDestroyEntityResponsePacket } from "./Network/McApiPackets/Response/McApiDestroyEntityResponsePacket";
import { McApiOnEffectUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEffectUpdatedPacket";
import { McApiOnEntityCreatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityCreatedPacket";
import { McApiOnNetworkEntityCreatedPacket } from "./Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import { McApiOnEntityDestroyedPacket } from "./Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";
import { McApiOnEntityVisibilityUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityVisibilityUpdated";
import { McApiOnEntityWorldIdUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityWorldIdUpdated";
import { McApiOnEntityNameUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityNameUpdated";
import { McApiOnEntityMuteUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityMuteUpdated";
import { McApiOnEntityDeafenUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityDeafenUpdated";
import { McApiOnEntityServerMuteUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityServerMuteUpdated";
import { McApiOnEntityServerDeafenUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityServerDeafenUpdated";
import { McApiOnEntityTalkBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityTalkBitmaskUpdated";
import { McApiOnEntityListenBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityListenBitmaskUpdated";
import { McApiOnEntityEffectBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityEffectBitmaskUpdated";
import { McApiOnEntityPositionUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityPositionUpdated";
import { McApiOnEntityRotationUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityRotationUpdated";
import { McApiOnEntityCaveFactorUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityCaveFactorUpdated";
import { McApiOnEntityMuffleFactorUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityMuffleFactorUpdated";
import { McApiOnEntityAudioReceivedPacket } from "./Network/McApiPackets/Event/McApiOnEntityAudioReceivedPacket";
import { Queue } from "./Data/Queue";
export class McApiClient {
    _connectionState = McApiConnectionState.Disconnected;
    _token;
    _lastPing = 0;
    OutboundQueue = new Queue();
    InboundQueue = new Queue();
    get Token() {
        return this._token;
    }
    set Token(value) {
        this._token = value;
    }
    get LastPing() {
        return this._lastPing;
    }
    set LastPing(value) {
        this._lastPing = value;
    }
    //Events
    OnPacketReceived = new Event();
    OnConnected = new Event();
    OnDisconnected = new Event();
    get ConnectionState() {
        return this._connectionState;
    }
    set ConnectionState(value) {
        this._connectionState = value;
    }
    ProcessPacket(reader, onParsed) {
        const packetType = reader.GetByte();
        switch (packetType) {
            case McApiPacketType.AcceptResponse:
                this.ProcessPacketType(reader, onParsed, () => new McApiAcceptResponsePacket());
                break;
            case McApiPacketType.DenyResponse:
                this.ProcessPacketType(reader, onParsed, () => new McApiDenyResponsePacket());
                break;
            case McApiPacketType.PingResponse:
                this.ProcessPacketType(reader, onParsed, () => new McApiPingResponsePacket());
                break;
            case McApiPacketType.ResetResponse:
                this.ProcessPacketType(reader, onParsed, () => new McApiResetResponsePacket());
                break;
            case McApiPacketType.CreateEntityResponse:
                this.ProcessPacketType(reader, onParsed, () => new McApiCreateEntityResponsePacket());
                break;
            case McApiPacketType.DestroyEntityResponse:
                this.ProcessPacketType(reader, onParsed, () => new McApiDestroyEntityResponsePacket());
                break;
            case McApiPacketType.OnEffectUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEffectUpdatedPacket());
                break;
            case McApiPacketType.OnEntityCreated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityCreatedPacket());
                break;
            case McApiPacketType.OnNetworkEntityCreated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnNetworkEntityCreatedPacket());
                break;
            case McApiPacketType.OnEntityDestroyed:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityDestroyedPacket());
                break;
            case McApiPacketType.OnEntityVisibilityUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityVisibilityUpdatedPacket());
                break;
            case McApiPacketType.OnEntityWorldIdUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityWorldIdUpdatedPacket());
                break;
            case McApiPacketType.OnEntityNameUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityNameUpdatedPacket());
                break;
            case McApiPacketType.OnEntityMuteUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityMuteUpdatedPacket());
                break;
            case McApiPacketType.OnEntityDeafenUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityDeafenUpdatedPacket());
                break;
            case McApiPacketType.OnEntityServerMuteUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityServerMuteUpdatedPacket());
                break;
            case McApiPacketType.OnEntityServerDeafenUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityServerDeafenUpdatedPacket());
                break;
            case McApiPacketType.OnEntityTalkBitmaskUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityTalkBitmaskUpdatedPacket());
                break;
            case McApiPacketType.OnEntityListenBitmaskUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityListenBitmaskUpdatedPacket());
                break;
            case McApiPacketType.OnEntityEffectBitmaskUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityEffectBitmaskUpdatedPacket());
                break;
            case McApiPacketType.OnEntityPositionUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityPositionUpdatedPacket());
                break;
            case McApiPacketType.OnEntityRotationUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityRotationUpdatedPacket());
                break;
            case McApiPacketType.OnEntityCaveFactorUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityCaveFactorUpdatedPacket());
                break;
            case McApiPacketType.OnEntityMuffleFactorUpdated:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityMuffleFactorUpdatedPacket());
                break;
            case McApiPacketType.OnEntityAudioReceived:
                this.ProcessPacketType(reader, onParsed, () => new McApiOnEntityAudioReceivedPacket());
                break;
            default:
                return;
        }
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
    AuthorizePacket(packet, token) {
        switch (packet.constructor) {
            case McApiAcceptResponsePacket:
            case McApiDenyResponsePacket:
                return true;
            default:
                return this.ConnectionState === McApiConnectionState.Connected && token === this.Token;
        }
    }
    ProcessPacketType(reader, onParsed, packetFactory) {
        const packet = packetFactory();
        packet.Deserialize(reader);
        this.OnPacketReceived?.Invoke(packet);
        onParsed(packet);
    }
    HandleAcceptResponsePacket(packet) {
        this.Token = packet.Token;
        this._connectionState = McApiConnectionState.Connected;
        this.OnConnected?.Invoke(packet.Token);
    }
    HandleDenyResponsePacket(packet) {
        if (this.ConnectionState !== McApiConnectionState.Connecting)
            return;
        this.DisconnectAsync(packet.Reason, true).then();
    }
}
