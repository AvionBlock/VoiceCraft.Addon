import { system } from "@minecraft/server";
import { Z85 } from "./Encoders/Z85";
import { McApiConnectionState, McApiPacketType } from "./Data/Enums";
import { NetDataReader } from "./Data/NetDataReader";
import { Event } from "./Event";
import { NetDataWriter } from "./Data/NetDataWriter";
import { Version } from "./Data/Version";
import { McApiLoginRequestPacket } from "./Network/McApiPackets/Request/McApiLoginRequestPacket";
import { McApiLogoutRequestPacket } from "./Network/McApiPackets/Request/McApiLogoutRequestPacket";
import { McApiPingRequestPacket } from "./Network/McApiPackets/Request/McApiPingRequestPacket";
import { McApiAcceptResponsePacket } from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import { McApiDenyResponsePacket } from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import { McApiPingResponsePacket } from "./Network/McApiPackets/Response/McApiPingResponsePacket";
import { McApiEventRequestPacket } from "./Network/McApiPackets/Request/McApiEventRequestPacket";
import { McApiResetRequestPacket } from "./Network/McApiPackets/Request/McApiResetRequestPacket";
import { McApiSetEffectRequestPacket } from "./Network/McApiPackets/Request/McApiSetEffectRequestPacket";
import { McApiClearEffectsRequestPacket } from "./Network/McApiPackets/Request/McApiClearEffectsRequestPacket";
import { McApiCreateEntityRequestPacket } from "./Network/McApiPackets/Request/McApiCreateEntityRequestPacket";
import { McApiDestroyEntityRequestPacket } from "./Network/McApiPackets/Request/McApiDestroyEntityRequestPacket";
import { McApiEntityAudioRequestPacket } from "./Network/McApiPackets/Request/McApiEntityAudioRequestPacket";
import { McApiSetEntityTitleRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityTitleRequestPacket";
import { McApiSetEntityDescriptionRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import { McApiSetEntityWorldIdRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
import { McApiSetEntityNameRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityNameRequestPacket";
import { McApiSetEntityMuteRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityMuteRequestPacket";
import { McApiSetEntityDeafenRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityDeafenRequestPacket";
import { McApiSetEntityTalkBitmaskRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityTalkBitmaskRequestPacket";
import { McApiSetEntityListenBitmaskRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityListenBitmaskRequestPacket";
import { McApiSetEntityEffectBitmaskRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityEffectBitmaskRequestPacket";
import { McApiSetEntityPositionRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityPositionRequestPacket";
import { McApiSetEntityRotationRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityRotationRequestPacket";
import { McApiResetResponsePacket } from "./Network/McApiPackets/Response/McApiResetResponsePacket";
import { McApiDestroyEntityResponsePacket } from "./Network/McApiPackets/Response/McApiDestroyEntityResponsePacket";
import { McApiCreateEntityResponsePacket } from "./Network/McApiPackets/Response/McApiCreateEntityResponsePacket";
import { McApiSetEntityPropertyRequestPacket } from "./Network/McApiPackets/Request/McApiSetEntityPropertyRequestPacket";
import { McApiOnEffectUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEffectUpdatedPacket";
import { McApiOnEntityCreatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityCreatedPacket";
import { McApiOnNetworkEntityCreatedPacket } from "./Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import { McApiOnEntityDestroyedPacket } from "./Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";
import { McApiOnEntityVisibilityUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityVisibilityUpdatedPacket";
import { McApiOnEntityWorldIdUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityWorldIdUpdatedPacket";
import { McApiOnEntityNameUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityNameUpdatedPacket";
import { McApiOnEntityMuteUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityMuteUpdatedPacket";
import { McApiOnEntityDeafenUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityDeafenUpdatedPacket";
import { McApiOnEntityServerMuteUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityServerMuteUpdatedPacket";
import { McApiOnEntityServerDeafenUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityServerDeafenUpdatedPacket";
import { McApiOnEntityTalkBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityTalkBitmaskUpdatedPacket";
import { McApiOnEntityListenBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityListenBitmaskUpdatedPacket";
import { McApiOnEntityEffectBitmaskUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityEffectBitmaskUpdatedPacket";
import { McApiOnEntityPositionUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityPositionUpdatedPacket";
import { McApiOnEntityRotationUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityRotationUpdatedPacket";
import { McApiOnEntityPropertyUpdatedPacket } from "./Network/McApiPackets/Event/McApiOnEntityPropertyUpdatedPacket";
import { McApiOnEntityAudioReceivedPacket } from "./Network/McApiPackets/Event/McApiOnEntityAudioReceivedPacket";
import { McApiOnEntityAudioDataReceivedPacket } from "./Network/McApiPackets/Event/McApiOnEntityAudioDataReceivedPacket";
export class VoiceCraft {
    _internal;
    static Version = new Version(1, 7, 0);
    static Namespace = "voicecraft";
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _connectionState = McApiConnectionState.Disconnected; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
    _token;
    constructor(_internal = false) {
        this._internal = _internal;
        if (!this._internal) {
            system.afterEvents.scriptEventReceive.subscribe((ev) => this.HandleScriptEvent(ev));
        }
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
    OnPlayerBind = new Event();
    OnPlayerUnbind = new Event();
    OnPacket = new Event();
    //McApi
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
    OnEventRequestPacket = new Event();
    OnResetRequestPacket = new Event();
    OnSetEffectRequestPacket = new Event();
    OnClearEffectsRequestPacket = new Event();
    OnCreateEntityRequestPacket = new Event();
    OnDestroyEntityRequestPacket = new Event();
    OnEntityAudioRequestPacket = new Event();
    OnSetEntityTitleRequestPacket = new Event();
    OnSetEntityDescriptionRequestPacket = new Event();
    OnSetEntityWorldIdRequestPacket = new Event();
    OnSetEntityNameRequestPacket = new Event();
    OnSetEntityMuteRequestPacket = new Event();
    OnSetEntityDeafenRequestPacket = new Event();
    OnSetEntityTalkBitmaskRequestPacket = new Event();
    OnSetEntityListenBitmaskRequestPacket = new Event();
    OnSetEntityEffectBitmaskRequestPacket = new Event();
    OnSetEntityPositionRequestPacket = new Event();
    OnSetEntityRotationRequestPacket = new Event();
    OnSetEntityPropertyRequestPacket = new Event();
    //Responses
    OnResetResponsePacket = new Event();
    OnCreateEntityResponsePacket = new Event();
    OnDestroyEntityResponsePacket = new Event();
    //Event Packets
    OnEffectUpdatedPacket = new Event();
    OnEntityCreatedPacket = new Event();
    OnNetworkEntityCreatedPacket = new Event();
    OnEntityDestroyedPacket = new Event();
    OnEntityVisibilityUpdatedPacket = new Event();
    OnEntityWorldIdUpdatedPacket = new Event();
    OnEntityNameUpdatedPacket = new Event();
    OnEntityMuteUpdatedPacket = new Event();
    OnEntityDeafenUpdatedPacket = new Event();
    OnEntityServerMuteUpdatedPacket = new Event();
    OnEntityServerDeafenUpdatedPacket = new Event();
    OnEntityTalkBitmaskUpdatedPacket = new Event();
    OnEntityListenBitmaskUpdatedPacket = new Event();
    OnEntityEffectBitmaskUpdatedPacket = new Event();
    OnEntityPositionUpdatedPacket = new Event();
    OnEntityRotationUpdatedPacket = new Event();
    OnEntityPropertyUpdatedPacket = new Event();
    OnEntityAudioReceivedPacket = new Event();
    OnEntityAudioDataReceivedPacket = new Event();
    SendPacket(packet) {
        if (this._internal)
            throw new Error("VoiceCraft instance set to internal! Use the base McApi socket to send packets!");
        if (this._connectionState !== McApiConnectionState.Connected)
            throw new Error("Not connected!");
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        packet.Serialize(this._writer); //Serialize
        const packetData = Z85.GetStringWithPadding(this._writer.Data.subarray(0, this._writer.Length));
        if (packetData.length <= 0)
            return;
        system.sendScriptEvent(`${VoiceCraft.Namespace}:sendPacket`, packetData);
    }
    HandlePacket(reader, onParsed) {
        const packetType = this._reader.GetByte();
        switch (packetType) {
            case McApiPacketType.LoginRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiLoginRequestPacket());
                break;
            case McApiPacketType.LogoutRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiLogoutRequestPacket());
                break;
            case McApiPacketType.PingRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiPingRequestPacket());
                break;
            case McApiPacketType.AcceptResponse:
                this.ProcessPacket(reader, onParsed, () => new McApiAcceptResponsePacket());
                break;
            case McApiPacketType.DenyResponse:
                this.ProcessPacket(reader, onParsed, () => new McApiDenyResponsePacket());
                break;
            case McApiPacketType.PingResponse:
                this.ProcessPacket(reader, onParsed, () => new McApiPingResponsePacket());
                break;
            case McApiPacketType.EventRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiEventRequestPacket());
                break;
            case McApiPacketType.ResetRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiResetRequestPacket());
                break;
            case McApiPacketType.SetEffectRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEffectRequestPacket());
                break;
            case McApiPacketType.ClearEffectsRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiClearEffectsRequestPacket());
                break;
            case McApiPacketType.CreateEntityRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiCreateEntityRequestPacket());
                break;
            case McApiPacketType.DestroyEntityRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiDestroyEntityRequestPacket());
                break;
            case McApiPacketType.EntityAudioRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiEntityAudioRequestPacket());
                break;
            case McApiPacketType.SetEntityTitleRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityTitleRequestPacket());
                break;
            case McApiPacketType.SetEntityDescriptionRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityDescriptionRequestPacket());
                break;
            case McApiPacketType.SetEntityWorldIdRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityWorldIdRequestPacket());
                break;
            case McApiPacketType.SetEntityNameRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityNameRequestPacket());
                break;
            case McApiPacketType.SetEntityMuteRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityMuteRequestPacket());
                break;
            case McApiPacketType.SetEntityDeafenRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityDeafenRequestPacket());
                break;
            case McApiPacketType.SetEntityTalkBitmaskRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityTalkBitmaskRequestPacket());
                break;
            case McApiPacketType.SetEntityListenBitmaskRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityListenBitmaskRequestPacket());
                break;
            case McApiPacketType.SetEntityEffectBitmaskRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityEffectBitmaskRequestPacket());
                break;
            case McApiPacketType.SetEntityPositionRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityPositionRequestPacket());
                break;
            case McApiPacketType.SetEntityRotationRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityRotationRequestPacket());
                break;
            case McApiPacketType.SetEntityPropertyRequest:
                this.ProcessPacket(reader, onParsed, () => new McApiSetEntityPropertyRequestPacket());
                break;
            case McApiPacketType.ResetResponse:
                this.ProcessPacket(reader, onParsed, () => new McApiResetResponsePacket());
                break;
            case McApiPacketType.CreateEntityResponse:
                this.ProcessPacket(reader, onParsed, () => new McApiCreateEntityResponsePacket());
                break;
            case McApiPacketType.DestroyEntityResponse:
                this.ProcessPacket(reader, onParsed, () => new McApiDestroyEntityResponsePacket());
                break;
        }
    }
    HandleScriptEvent(ev) {
        switch (ev.id) {
            case `${VoiceCraft.Namespace}:onPacket`:
                this.HandleOnPacketEvent(ev.message);
                break;
            case `${VoiceCraft.Namespace}:onConnected`:
                this.HandleOnConnectedEvent(ev.message);
                break;
            case `${VoiceCraft.Namespace}:onDisconnected`:
                this.HandleOnDisconnectedEvent(ev.message);
                break;
            case `${VoiceCraft.Namespace}:onPlayerBind`:
                this.HandleOnPlayerBindEvent(ev.message);
                break;
            case `${VoiceCraft.Namespace}:onPlayerUnbind`:
                this.HandleOnPlayerUnbindEvent(ev.message);
                break;
        }
    }
    HandleOnPacketEvent(packet) {
        const packetData = Z85.GetBytesWithPadding(packet);
        if (packetData.length <= 0)
            return;
        this._reader.SetBufferSource(packetData);
        this.HandlePacket(this._reader, this.ExecutePacket);
    }
    HandleOnConnectedEvent(token) {
        this._token = token;
        this._connectionState = McApiConnectionState.Connected;
        this.OnConnected.Invoke(token);
    }
    HandleOnDisconnectedEvent(reason) {
        this._token = undefined;
        this._connectionState = McApiConnectionState.Disconnected;
        this.OnDisconnected.Invoke(reason);
    }
    HandleOnPlayerBindEvent(data) {
        const splitData = data.split(":");
        this.OnPlayerBind.Invoke({ playerId: splitData[0], entityId: splitData[1] });
    }
    HandleOnPlayerUnbindEvent(data) {
        const splitData = data.split(":");
        this.OnPlayerUnbind.Invoke({ playerId: splitData[0], entityId: splitData[1] });
    }
    ExecutePacket(packet) {
        switch (packet.constructor) {
            case McApiLoginRequestPacket:
                this.HandleLoginRequestPacket(packet);
                break;
            case McApiLogoutRequestPacket:
                this.HandleLogoutRequestPacket(packet);
                break;
            case McApiPingRequestPacket:
                this.HandlePingRequestPacket(packet);
                break;
            case McApiAcceptResponsePacket:
                this.HandleAcceptResponsePacket(packet);
                break;
            case McApiDenyResponsePacket:
                this.HandleDenyResponsePacket(packet);
                break;
            case McApiPingResponsePacket:
                this.HandlePingResponsePacket(packet);
                break;
            case McApiEventRequestPacket:
                this.HandleEventRequestPacket(packet);
                break;
            case McApiResetRequestPacket:
                this.HandleResetRequestPacket(packet);
                break;
            case McApiSetEffectRequestPacket:
                this.HandleSetEffectRequestPacket(packet);
                break;
            case McApiClearEffectsRequestPacket:
                this.HandleClearEffectsRequestPacket(packet);
                break;
            case McApiCreateEntityRequestPacket:
                this.HandleCreateEntityRequestPacket(packet);
                break;
            case McApiDestroyEntityRequestPacket:
                this.HandleDestroyEntityRequestPacket(packet);
                break;
            case McApiEntityAudioRequestPacket:
                this.HandleEntityAudioRequestPacket(packet);
                break;
            case McApiSetEntityTitleRequestPacket:
                this.HandleSetEntityTitleRequestPacket(packet);
                break;
            case McApiSetEntityDescriptionRequestPacket:
                this.HandleSetEntityDescriptionRequestPacket(packet);
                break;
            case McApiSetEntityWorldIdRequestPacket:
                this.HandleSetEntityWorldIdRequestPacket(packet);
                break;
            case McApiSetEntityNameRequestPacket:
                this.HandleSetEntityNameRequestPacket(packet);
                break;
            case McApiSetEntityMuteRequestPacket:
                this.HandleSetEntityMuteRequestPacket(packet);
                break;
            case McApiSetEntityDeafenRequestPacket:
                this.HandleSetEntityDeafenRequestPacket(packet);
                break;
            case McApiSetEntityTalkBitmaskRequestPacket:
                this.HandleSetEntityTalkBitmaskRequestPacket(packet);
                break;
            case McApiSetEntityListenBitmaskRequestPacket:
                this.HandleSetEntityListenBitmaskRequestPacket(packet);
                break;
            case McApiSetEntityEffectBitmaskRequestPacket:
                this.HandleSetEntityEffectBitmaskRequestPacket(packet);
                break;
            case McApiSetEntityPositionRequestPacket:
                this.HandleSetEntityPositionRequestPacket(packet);
                break;
            case McApiSetEntityRotationRequestPacket:
                this.HandleSetEntityRotationRequestPacket(packet);
                break;
            case McApiSetEntityPropertyRequestPacket:
                this.HandleSetEntityPropertyRequestPacket(packet);
                break;
            case McApiResetResponsePacket:
                this.HandleResetResponsePacket(packet);
                break;
            case McApiCreateEntityResponsePacket:
                this.HandleCreateEntityResponsePacket(packet);
                break;
            case McApiDestroyEntityResponsePacket:
                this.HandleDestroyEntityResponsePacket(packet);
                break;
        }
    }
    //Packet Handling
    HandleLoginRequestPacket(packet) {
        this.OnLoginRequestPacket.Invoke(packet);
    }
    HandleLogoutRequestPacket(packet) {
        this.OnLogoutRequestPacket.Invoke(packet);
    }
    HandlePingRequestPacket(packet) {
        this.OnPingRequestPacket.Invoke(packet);
    }
    HandleAcceptResponsePacket(packet) {
        this.OnAcceptResponsePacket.Invoke(packet);
    }
    HandleDenyResponsePacket(packet) {
        this.OnDenyResponsePacket.Invoke(packet);
    }
    HandlePingResponsePacket(packet) {
        this.OnPingResponsePacket.Invoke(packet);
    }
    HandleEventRequestPacket(packet) {
        this.OnEventRequestPacket.Invoke(packet);
        switch (packet.Event?.constructor) {
            case McApiOnEffectUpdatedPacket:
                this.HandleOnEffectUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityCreatedPacket:
                this.HandleOnEntityCreatedPacket(packet.Event);
                break;
            case McApiOnNetworkEntityCreatedPacket:
                this.HandleOnNetworkEntityCreatedPacket(packet.Event);
                break;
            case McApiOnEntityDestroyedPacket:
                this.HandleOnEntityDestroyedPacket(packet.Event);
                break;
            case McApiOnEntityVisibilityUpdatedPacket:
                this.HandleOnEntityVisibilityUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityWorldIdUpdatedPacket:
                this.HandleOnEntityWorldIdUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityNameUpdatedPacket:
                this.HandleOnEntityNameUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityMuteUpdatedPacket:
                this.HandleOnEntityMuteUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityDeafenUpdatedPacket:
                this.HandleOnEntityDeafenUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityServerMuteUpdatedPacket:
                this.HandleOnEntityServerMuteUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityServerDeafenUpdatedPacket:
                this.HandleOnEntityServerDeafenUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityTalkBitmaskUpdatedPacket:
                this.HandleOnEntityTalkBitmaskUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityListenBitmaskUpdatedPacket:
                this.HandleOnEntityListenBitmaskUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityEffectBitmaskUpdatedPacket:
                this.HandleOnEntityEffectBitmaskUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityPositionUpdatedPacket:
                this.HandleOnEntityPositionUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityRotationUpdatedPacket:
                this.HandleOnEntityRotationUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityPropertyUpdatedPacket:
                this.HandleOnEntityPropertyUpdatedPacket(packet.Event);
                break;
            case McApiOnEntityAudioReceivedPacket:
                this.HandleOnEntityAudioReceivedPacket(packet.Event);
                break;
            case McApiOnEntityAudioDataReceivedPacket:
                this.HandleOnEntityAudioDataReceivedPacket(packet.Event);
                break;
        }
    }
    HandleResetRequestPacket(packet) {
        this.OnResetRequestPacket.Invoke(packet);
    }
    HandleSetEffectRequestPacket(packet) {
        this.OnSetEffectRequestPacket.Invoke(packet);
    }
    HandleClearEffectsRequestPacket(packet) {
        this.OnClearEffectsRequestPacket.Invoke(packet);
    }
    HandleCreateEntityRequestPacket(packet) {
        this.OnCreateEntityRequestPacket.Invoke(packet);
    }
    HandleDestroyEntityRequestPacket(packet) {
        this.OnDestroyEntityRequestPacket.Invoke(packet);
    }
    HandleEntityAudioRequestPacket(packet) {
        this.OnEntityAudioRequestPacket.Invoke(packet);
    }
    HandleSetEntityTitleRequestPacket(packet) {
        this.OnSetEntityTitleRequestPacket.Invoke(packet);
    }
    HandleSetEntityDescriptionRequestPacket(packet) {
        this.OnSetEntityDescriptionRequestPacket.Invoke(packet);
    }
    HandleSetEntityWorldIdRequestPacket(packet) {
        this.OnSetEntityWorldIdRequestPacket.Invoke(packet);
    }
    HandleSetEntityNameRequestPacket(packet) {
        this.OnSetEntityNameRequestPacket.Invoke(packet);
    }
    HandleSetEntityMuteRequestPacket(packet) {
        this.OnSetEntityMuteRequestPacket.Invoke(packet);
    }
    HandleSetEntityDeafenRequestPacket(packet) {
        this.OnSetEntityDeafenRequestPacket.Invoke(packet);
    }
    HandleSetEntityTalkBitmaskRequestPacket(packet) {
        this.OnSetEntityTalkBitmaskRequestPacket.Invoke(packet);
    }
    HandleSetEntityListenBitmaskRequestPacket(packet) {
        this.OnSetEntityListenBitmaskRequestPacket.Invoke(packet);
    }
    HandleSetEntityEffectBitmaskRequestPacket(packet) {
        this.OnSetEntityEffectBitmaskRequestPacket.Invoke(packet);
    }
    HandleSetEntityPositionRequestPacket(packet) {
        this.OnSetEntityPositionRequestPacket.Invoke(packet);
    }
    HandleSetEntityRotationRequestPacket(packet) {
        this.OnSetEntityRotationRequestPacket.Invoke(packet);
    }
    HandleSetEntityPropertyRequestPacket(packet) {
        this.OnSetEntityPropertyRequestPacket.Invoke(packet);
    }
    HandleResetResponsePacket(packet) {
        this.OnResetResponsePacket.Invoke(packet);
    }
    HandleCreateEntityResponsePacket(packet) {
        this.OnCreateEntityResponsePacket.Invoke(packet);
    }
    HandleDestroyEntityResponsePacket(packet) {
        this.OnDestroyEntityResponsePacket.Invoke(packet);
    }
    //Event Handling
    HandleOnEffectUpdatedPacket(packet) {
        this.OnEffectUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityCreatedPacket(packet) {
        this.OnEntityCreatedPacket.Invoke(packet);
    }
    HandleOnNetworkEntityCreatedPacket(packet) {
        this.OnNetworkEntityCreatedPacket.Invoke(packet);
    }
    HandleOnEntityDestroyedPacket(packet) {
        this.OnEntityDestroyedPacket.Invoke(packet);
    }
    HandleOnEntityVisibilityUpdatedPacket(packet) {
        this.OnEntityVisibilityUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityWorldIdUpdatedPacket(packet) {
        this.OnEntityWorldIdUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityNameUpdatedPacket(packet) {
        this.OnEntityNameUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityMuteUpdatedPacket(packet) {
        this.OnEntityMuteUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityDeafenUpdatedPacket(packet) {
        this.OnEntityDeafenUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityServerMuteUpdatedPacket(packet) {
        this.OnEntityServerMuteUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityServerDeafenUpdatedPacket(packet) {
        this.OnEntityServerDeafenUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityTalkBitmaskUpdatedPacket(packet) {
        this.OnEntityTalkBitmaskUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityListenBitmaskUpdatedPacket(packet) {
        this.OnEntityListenBitmaskUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityEffectBitmaskUpdatedPacket(packet) {
        this.OnEntityEffectBitmaskUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityPositionUpdatedPacket(packet) {
        this.OnEntityPositionUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityRotationUpdatedPacket(packet) {
        this.OnEntityRotationUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityPropertyUpdatedPacket(packet) {
        this.OnEntityPropertyUpdatedPacket.Invoke(packet);
    }
    HandleOnEntityAudioReceivedPacket(packet) {
        this.OnEntityAudioReceivedPacket.Invoke(packet);
    }
    HandleOnEntityAudioDataReceivedPacket(packet) {
        this.OnEntityAudioDataReceivedPacket.Invoke(packet);
    }
    ProcessPacket(reader, onParsed, packetFactory) {
        const packet = packetFactory();
        packet.Deserialize(reader);
        this.OnPacket.Invoke(packet);
        onParsed(packet);
    }
}
