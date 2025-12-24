import { system } from "@minecraft/server";
import { Z85 } from "./Encoders/Z85";
import { McApiPacketType } from "./Data/Enums";
import { NetDataReader } from "./Network/NetDataReader";
import { Event } from "./Event";
import { NetDataWriter } from "./Network/NetDataWriter";
import { McApiAcceptResponsePacket } from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import { McApiDenyResponsePacket } from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import { McApiPingResponsePacket } from "./Network/McApiPackets/Response/McApiPingResponsePacket";
import { McApiLoginRequestPacket } from "./Network/McApiPackets/Request/McApiLoginRequestPacket";
import { McApiPingRequestPacket } from "./Network/McApiPackets/Request/McApiPingRequestPacket";
import { McApiLogoutRequestPacket } from "./Network/McApiPackets/Request/McApiLogoutRequestPacket";
import { McApiOnEntityAudioReceivedPacket } from "./Network/McApiPackets/Event/McApiOnEntityAudioReceivedPacket";
import { McApiOnNetworkEntityCreatedPacket } from "./Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import { McApiOnEntityCreatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityCreatedPacket";
import { McApiOnEntityDestroyedPacket } from "./Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";
import { McApiSetEntityTitleRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityTitleRequestPacket";
import { McApiSetEntityDescriptionRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import { McApiOnEntityVisibilityUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityVisibilityUpdated";
import { McApiOnEntityWorldIdUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityWorldIdUpdated";
import { McApiOnEntityNameUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityNameUpdated";
import { McApiOnEntityMuteUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityMuteUpdated";
import { McApiOnEntityDeafenUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityDeafenUpdated";
import { McApiOnEntityTalkBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityTalkBitmaskUpdated";
import { McApiOnEntityListenBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityListenBitmaskUpdated";
import { McApiOnEntityEffectBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityEffectBitmaskUpdated";
import { McApiOnEntityPositionUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityPositionUpdated";
import { McApiOnEntityRotationUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityRotationUpdated";
import { McApiOnEntityCaveFactorUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityCaveFactorUpdated";
import { McApiOnEntityMuffleFactorUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityMuffleFactorUpdated";
import { McApiSetEntityNameRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityNameRequestPacket";
import { McApiSetEntityTalkBitmaskRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityTalkBitmaskRequestPacket";
import { McApiSetEntityListenBitmaskRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityListenBitmaskRequestPacket";
import { McApiSetEntityEffectBitmaskRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityEffectBitmaskRequestPacket";
import { McApiSetEntityPositionRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityPositionRequestPacket";
import { McApiSetEntityRotationRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityRotationRequestPacket";
import { McApiSetEntityCaveFactorRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityCaveFactorRequestPacket";
import { McApiSetEntityMuffleFactorRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityMuffleFactorRequestPacket";
import { McApiSetEntityWorldIdRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
import { McApiOnEffectUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEffectUpdatedPacket";
import { McApiSetEffectRequestPacket } from "./Network/McApiPackets/Request/McApiSetEffectRequestPacket";
import { McApiClearEffectsRequestPacket } from "./Network/McApiPackets/Request/McApiClearEffectsRequestPacket";
export class VoiceCraft {
    static Namespace = "voicecraft";
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _connectionState = 0; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
    _token;
    constructor() {
        system.afterEvents.scriptEventReceive.subscribe((ev) => this.HandleScriptEventAsync(ev));
    }
    //Properties
    get ConnectionState() {
        return this._connectionState;
    }
    get Token() {
        return this._token;
    }
    //Events
    OnConnected = new Event();
    OnDisconnected = new Event();
    //McApi
    OnPacket = new Event();
    //Core
    //Requests
    OnLoginRequestPacket = new Event();
    OnLogoutRequestPacket = new Event();
    OnPingRequestPacket = new Event();
    //Responses
    OnAcceptResponsePacket = new Event();
    OnDenyResponsePacket = new Event();
    OnPingResponsePacket = new Event();
    //Requests
    OnSetEffectRequestPacket = new Event();
    OnClearEffectsRequestPacket = new Event();
    OnSetEntityTitleRequestPacket = new Event();
    OnSetEntityDescriptionRequestPacket = new Event();
    OnSetEntityWorldIdRequestPacket = new Event();
    OnSetEntityNameRequestPacket = new Event();
    OnSetEntityTalkBitmaskRequestPacket = new Event();
    OnSetEntityListenBitmaskRequestPacket = new Event();
    OnSetEntityEffectBitmaskRequestPacket = new Event();
    OnSetEntityPositionRequestPacket = new Event();
    OnSetEntityRotationRequestPacket = new Event();
    OnSetEntityCaveFactorRequestPacket = new Event();
    OnSetEntityMuffleFactorRequestPacket = new Event();
    //Response
    //Events
    OnEffectUpdatedPacket = new Event();
    OnEntityCreatedPacket = new Event();
    OnNetworkEntityCreatedPacket = new Event();
    OnEntityDestroyedPacket = new Event();
    OnEntityVisibilityUpdatedPacket = new Event();
    OnEntityWorldIdUpdatedPacket = new Event();
    OnEntityNameUpdatedPacket = new Event();
    OnEntityMuteUpdatedPacket = new Event();
    OnEntityDeafenUpdatedPacket = new Event();
    OnEntityTalkBitmaskUpdatedPacket = new Event();
    OnEntityListenBitmaskUpdatedPacket = new Event();
    OnEntityEffectBitmaskUpdatedPacket = new Event();
    OnEntityPositionUpdatedPacket = new Event();
    OnEntityRotationUpdatedPacket = new Event();
    OnEntityCaveFactorUpdatedPacket = new Event();
    OnEntityMuffleFactorUpdatedPacket = new Event();
    OnEntityAudioReceivedPacket = new Event();
    SendPacket(packet) {
        if (this._connectionState !== 2)
            throw new Error("Not connected!");
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        packet.Serialize(this._writer); //Serialize
        const packetData = Z85.GetStringWithPadding(this._writer.Data.subarray(0, this._writer.Length));
        if (packetData.length <= 0)
            return;
        system.sendScriptEvent(`${VoiceCraft.Namespace}:sendPacket`, packetData);
    }
    async HandleScriptEventAsync(ev) {
        switch (ev.id) {
            case `${VoiceCraft.Namespace}:onPacket`:
                await this.HandleOnPacketEventAsync(ev.message);
                break;
            case `${VoiceCraft.Namespace}:onConnected`:
                this.HandleOnConnectedEvent(ev.message);
                break;
            case `${VoiceCraft.Namespace}:onDisconnected`:
                this.HandleOnDisconnectedEvent(ev.message);
                break;
        }
    }
    async HandleOnPacketEventAsync(packet) {
        const packetData = Z85.GetBytesWithPadding(packet);
        if (packetData.length <= 0)
            return;
        this._reader.SetBufferSource(packetData);
        const packetType = this._reader.GetByte();
        if (packetType < McApiPacketType.LoginRequest || packetType > McApiPacketType.OnEntityAudioReceived)
            return; //Not a valid packet.
        await this.HandlePacketAsync(packetType, this._reader);
    }
    HandleOnConnectedEvent(token) {
        this._token = token;
        this._connectionState = 2;
        this.OnConnected.Invoke(token);
    }
    HandleOnDisconnectedEvent(reason) {
        this._token = undefined;
        this._connectionState = 0;
        this.OnDisconnected.Invoke(reason);
    }
    async HandlePacketAsync(packetType, reader) {
        switch (packetType) {
            case McApiPacketType.LoginRequest:
                const loginRequestPacket = new McApiLoginRequestPacket();
                loginRequestPacket.Deserialize(reader);
                this.HandleLoginRequestPacket(loginRequestPacket);
                break;
            case McApiPacketType.LogoutRequest:
                const logoutRequestPacket = new McApiLogoutRequestPacket();
                logoutRequestPacket.Deserialize(reader);
                this.HandleLogoutRequestPacket(logoutRequestPacket);
                break;
            case McApiPacketType.PingRequest:
                const pingRequestPacket = new McApiPingRequestPacket();
                pingRequestPacket.Deserialize(reader);
                this.HandlePingRequestPacket(pingRequestPacket);
                break;
            case McApiPacketType.AcceptResponse:
                const acceptResponsePacket = new McApiAcceptResponsePacket();
                acceptResponsePacket.Deserialize(reader);
                this.HandleAcceptResponsePacket(acceptResponsePacket);
                break;
            case McApiPacketType.DenyResponse:
                const denyResponsePacket = new McApiDenyResponsePacket();
                denyResponsePacket.Deserialize(reader);
                this.HandleDenyResponsePacket(denyResponsePacket);
                break;
            case McApiPacketType.PingResponse:
                const pingResponsePacket = new McApiPingResponsePacket();
                pingResponsePacket.Deserialize(reader);
                this.HandlePingResponsePacket(pingResponsePacket);
                break;
            case McApiPacketType.SetEffectRequest:
                const setEffectRequestPacket = new McApiSetEffectRequestPacket();
                setEffectRequestPacket.Deserialize(reader);
                this.HandleSetEffectRequestPacket(setEffectRequestPacket);
                break;
            case McApiPacketType.ClearEffectsRequest:
                const clearEffectsRequestPacket = new McApiClearEffectsRequestPacket();
                clearEffectsRequestPacket.Deserialize(reader);
                this.HandleClearEffectsRequestPacket(clearEffectsRequestPacket);
                break;
            case McApiPacketType.SetEntityTitleRequest:
                const setEntityTitleRequestPacket = new McApiSetEntityTitleRequestPacket();
                setEntityTitleRequestPacket.Deserialize(reader);
                this.HandleSetEntityTitleRequestPacket(setEntityTitleRequestPacket);
                break;
            case McApiPacketType.SetEntityDescriptionRequest:
                const setEntityDescriptionRequestPacket = new McApiSetEntityDescriptionRequestPacket();
                setEntityDescriptionRequestPacket.Deserialize(reader);
                this.HandleSetEntityDescriptionRequestPacket(setEntityDescriptionRequestPacket);
                break;
            case McApiPacketType.SetEntityWorldIdRequest:
                const setEntityWorldIdRequestPacket = new McApiSetEntityWorldIdRequestPacket();
                setEntityWorldIdRequestPacket.Deserialize(reader);
                this.HandleSetEntityWorldIdRequestPacket(setEntityWorldIdRequestPacket);
                break;
            case McApiPacketType.SetEntityNameRequest:
                const setEntityNameRequestPacket = new McApiSetEntityNameRequestPacket();
                setEntityNameRequestPacket.Deserialize(reader);
                this.HandleSetEntityNameRequestPacket(setEntityNameRequestPacket);
                break;
            case McApiPacketType.SetEntityTalkBitmaskRequest:
                const setEntityTalkBitmaskRequestPacket = new McApiSetEntityTalkBitmaskRequestPacket();
                setEntityTalkBitmaskRequestPacket.Deserialize(reader);
                this.HandleSetEntityTalkBitmaskRequestPacket(setEntityTalkBitmaskRequestPacket);
                break;
            case McApiPacketType.SetEntityListenBitmaskRequest:
                const setEntityListenBitmaskRequestPacket = new McApiSetEntityListenBitmaskRequestPacket();
                setEntityListenBitmaskRequestPacket.Deserialize(reader);
                this.HandleSetEntityListenBitmaskRequestPacket(setEntityListenBitmaskRequestPacket);
                break;
            case McApiPacketType.SetEntityEffectBitmaskRequest:
                const setEntityEffectBitmaskRequestPacket = new McApiSetEntityEffectBitmaskRequestPacket();
                setEntityEffectBitmaskRequestPacket.Deserialize(reader);
                this.HandleSetEntityEffectBitmaskRequestPacket(setEntityEffectBitmaskRequestPacket);
                break;
            case McApiPacketType.SetEntityPositionRequest:
                const setEntityPositionRequestPacket = new McApiSetEntityPositionRequestPacket();
                setEntityPositionRequestPacket.Deserialize(reader);
                this.HandleSetEntityPositionRequestPacket(setEntityPositionRequestPacket);
                break;
            case McApiPacketType.SetEntityRotationRequest:
                const setEntityRotationRequestPacket = new McApiSetEntityRotationRequestPacket();
                setEntityRotationRequestPacket.Deserialize(reader);
                this.HandleSetEntityRotationRequestPacket(setEntityRotationRequestPacket);
                break;
            case McApiPacketType.SetEntityCaveFactorRequest:
                const setEntityCaveFactorRequestPacket = new McApiSetEntityCaveFactorRequestPacket();
                setEntityCaveFactorRequestPacket.Deserialize(reader);
                this.HandleSetEntityCaveFactorRequestPacket(setEntityCaveFactorRequestPacket);
                break;
            case McApiPacketType.SetEntityMuffleFactorRequest:
                const setEntityMuffleFactorRequestPacket = new McApiSetEntityMuffleFactorRequestPacket();
                setEntityMuffleFactorRequestPacket.Deserialize(reader);
                this.HandleSetEntityMuffleFactorRequestPacket(setEntityMuffleFactorRequestPacket);
                break;
            case McApiPacketType.OnEffectUpdated:
                const onEffectUpdatedPacket = new McApiOnEffectUpdatedPacket();
                onEffectUpdatedPacket.Deserialize(reader);
                this.HandleOnEffectUpdatedPacket(onEffectUpdatedPacket);
                break;
            case McApiPacketType.OnEntityCreated:
                const onEntityCreatedPacket = new McApiOnEntityCreatedPacket();
                onEntityCreatedPacket.Deserialize(reader);
                this.HandleOnEntityCreatedPacket(onEntityCreatedPacket);
                break;
            case McApiPacketType.OnNetworkEntityCreated:
                const onNetworkEntityCreatedPacket = new McApiOnNetworkEntityCreatedPacket();
                onNetworkEntityCreatedPacket.Deserialize(reader);
                this.HandleOnNetworkEntityCreatedPacket(onNetworkEntityCreatedPacket);
                break;
            case McApiPacketType.OnEntityDestroyed:
                const onEntityDestroyedPacket = new McApiOnEntityDestroyedPacket();
                onEntityDestroyedPacket.Deserialize(reader);
                this.HandleOnEntityDestroyedPacket(onEntityDestroyedPacket);
                break;
            case McApiPacketType.OnEntityVisibilityUpdated:
                const onEntityVisibilityUpdatedPacket = new McApiOnEntityVisibilityUpdatedPacket();
                onEntityVisibilityUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityVisibilityUpdatedPacket(onEntityVisibilityUpdatedPacket);
                break;
            case McApiPacketType.OnEntityWorldIdUpdated:
                const onEntityWorldIdUpdatedPacket = new McApiOnEntityWorldIdUpdatedPacket();
                onEntityWorldIdUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityWorldIdUpdatedPacket(onEntityWorldIdUpdatedPacket);
                break;
            case McApiPacketType.OnEntityNameUpdated:
                const onEntityNameUpdatedPacket = new McApiOnEntityNameUpdatedPacket();
                onEntityNameUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityNameUpdatedPacket(onEntityNameUpdatedPacket);
                break;
            case McApiPacketType.OnEntityMuteUpdated:
                const onEntityMuteUpdatedPacket = new McApiOnEntityMuteUpdatedPacket();
                onEntityMuteUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityMuteUpdatedPacket(onEntityMuteUpdatedPacket);
                break;
            case McApiPacketType.OnEntityDeafenUpdated:
                const onEntityDeafenUpdatedPacket = new McApiOnEntityDeafenUpdatedPacket();
                onEntityDeafenUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityDeafenUpdatedPacket(onEntityDeafenUpdatedPacket);
                break;
            case McApiPacketType.OnEntityTalkBitmaskUpdated:
                const onEntityTalkBitmaskUpdatedPacket = new McApiOnEntityTalkBitmaskUpdatedPacket();
                onEntityTalkBitmaskUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityTalkBitmaskUpdatedPacket(onEntityTalkBitmaskUpdatedPacket);
                break;
            case McApiPacketType.OnEntityListenBitmaskUpdated:
                const onEntityListenBitmaskUpdatedPacket = new McApiOnEntityListenBitmaskUpdatedPacket();
                onEntityListenBitmaskUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityListenBitmaskUpdatedPacket(onEntityListenBitmaskUpdatedPacket);
                break;
            case McApiPacketType.OnEntityEffectBitmaskUpdated:
                const onEntityEffectBitmaskUpdatedPacket = new McApiOnEntityEffectBitmaskUpdatedPacket();
                onEntityEffectBitmaskUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityEffectBitmaskUpdatedPacket(onEntityEffectBitmaskUpdatedPacket);
                break;
            case McApiPacketType.OnEntityPositionUpdated:
                const onEntityPositionUpdatedPacket = new McApiOnEntityPositionUpdatedPacket();
                onEntityPositionUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityPositionUpdatedPacket(onEntityPositionUpdatedPacket);
                break;
            case McApiPacketType.OnEntityRotationUpdated:
                const onEntityRotationUpdatedPacket = new McApiOnEntityRotationUpdatedPacket();
                onEntityRotationUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityRotationUpdatedPacket(onEntityRotationUpdatedPacket);
                break;
            case McApiPacketType.OnEntityCaveFactorUpdated:
                const onEntityCaveFactorUpdatedPacket = new McApiOnEntityCaveFactorUpdatedPacket();
                onEntityCaveFactorUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityCaveFactorUpdatedPacket(onEntityCaveFactorUpdatedPacket);
                break;
            case McApiPacketType.OnEntityMuffleFactorUpdated:
                const onEntityMuffleFactorUpdatedPacket = new McApiOnEntityMuffleFactorUpdatedPacket();
                onEntityMuffleFactorUpdatedPacket.Deserialize(reader);
                this.HandleOnEntityMuffleFactorUpdatedPacket(onEntityMuffleFactorUpdatedPacket);
                break;
            case McApiPacketType.OnEntityAudioReceived:
                const onEntityAudioReceived = new McApiOnEntityAudioReceivedPacket();
                onEntityAudioReceived.Deserialize(reader);
                this.HandleOnEntityAudioReceivedPacket(onEntityAudioReceived);
                break;
        }
    }
    HandleLoginRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnLoginRequestPacket.Invoke(packet);
    }
    HandleLogoutRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnLogoutRequestPacket.Invoke(packet);
    }
    HandlePingRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnPingRequestPacket.Invoke(packet);
    }
    HandleAcceptResponsePacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnAcceptResponsePacket.Invoke(packet);
    }
    HandleDenyResponsePacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnDenyResponsePacket.Invoke(packet);
    }
    HandlePingResponsePacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnPingResponsePacket.Invoke(packet);
    }
    HandleSetEffectRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEffectRequestPacket.Invoke(packet);
    }
    HandleClearEffectsRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnClearEffectsRequestPacket.Invoke(packet);
    }
    HandleSetEntityTitleRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityTitleRequestPacket.Invoke(packet);
    }
    HandleSetEntityDescriptionRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityDescriptionRequestPacket.Invoke(packet);
    }
    HandleSetEntityWorldIdRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityWorldIdRequestPacket.Invoke(packet);
    }
    HandleSetEntityNameRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityNameRequestPacket.Invoke(packet);
    }
    HandleSetEntityTalkBitmaskRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityTalkBitmaskRequestPacket.Invoke(packet);
    }
    HandleSetEntityListenBitmaskRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityListenBitmaskRequestPacket.Invoke(packet);
    }
    HandleSetEntityEffectBitmaskRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityEffectBitmaskRequestPacket.Invoke(packet);
    }
    HandleSetEntityPositionRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityPositionRequestPacket.Invoke(packet);
    }
    HandleSetEntityRotationRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityRotationRequestPacket.Invoke(packet);
    }
    HandleSetEntityCaveFactorRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityCaveFactorRequestPacket.Invoke(packet);
    }
    HandleSetEntityMuffleFactorRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityMuffleFactorRequestPacket.Invoke(packet);
    }
    HandleOnEffectUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEffectUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityCreatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityCreatedPacket.Invoke(packet);
    }
    HandleOnNetworkEntityCreatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnNetworkEntityCreatedPacket.Invoke(packet);
    }
    HandleOnEntityDestroyedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityDestroyedPacket.Invoke(packet);
    }
    HandleOnEntityVisibilityUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityVisibilityUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityWorldIdUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityWorldIdUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityNameUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityNameUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityMuteUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityMuteUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityDeafenUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityDeafenUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityTalkBitmaskUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityTalkBitmaskUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityListenBitmaskUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityListenBitmaskUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityEffectBitmaskUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityEffectBitmaskUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityPositionUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityPositionUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityRotationUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityRotationUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityCaveFactorUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityCaveFactorUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityMuffleFactorUpdatedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityMuffleFactorUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityAudioReceivedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityAudioReceivedPacket.Invoke(packet);
    }
}
