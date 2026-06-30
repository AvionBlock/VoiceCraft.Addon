import {ScriptEventCommandMessageAfterEvent, system} from "@minecraft/server";
import {Z85} from "./Encoders/Z85";
import {McApiConnectionState, McApiPacketType} from "./Data/Enums";
import {NetDataReader} from "./Data/NetDataReader";
import {Event} from "./Event";
import {NetDataWriter} from "./Data/NetDataWriter";
import {IMcApiPacket} from "./Network/McApiPackets/IMcApiPacket";
import {Version} from "./Data/Version";
import {McApiLoginRequestPacket} from "./Network/McApiPackets/Request/McApiLoginRequestPacket";
import {McApiLogoutRequestPacket} from "./Network/McApiPackets/Request/McApiLogoutRequestPacket";
import {McApiPingRequestPacket} from "./Network/McApiPackets/Request/McApiPingRequestPacket";
import {McApiAcceptResponsePacket} from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import {McApiDenyResponsePacket} from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import {McApiPingResponsePacket} from "./Network/McApiPackets/Response/McApiPingResponsePacket";
import {McApiEventRequestPacket} from "./Network/McApiPackets/Request/McApiEventRequestPacket";
import {McApiResetRequestPacket} from "./Network/McApiPackets/Request/McApiResetRequestPacket";
import {McApiSetEffectRequestPacket} from "./Network/McApiPackets/Request/McApiSetEffectRequestPacket";
import {McApiClearEffectsRequestPacket} from "./Network/McApiPackets/Request/McApiClearEffectsRequestPacket";
import {McApiCreateEntityRequestPacket} from "./Network/McApiPackets/Request/McApiCreateEntityRequestPacket";
import {McApiDestroyEntityRequestPacket} from "./Network/McApiPackets/Request/McApiDestroyEntityRequestPacket";
import {McApiEntityAudioRequestPacket} from "./Network/McApiPackets/Request/McApiEntityAudioRequestPacket";
import {McApiSetEntityTitleRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityTitleRequestPacket";
import {McApiSetEntityDescriptionRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityDescriptionRequestPacket";
import {McApiSetEntityWorldIdRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityWorldIdRequestPacket";
import {McApiSetEntityNameRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityNameRequestPacket";
import {McApiSetEntityMuteRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityMuteRequestPacket";
import {McApiSetEntityDeafenRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityDeafenRequestPacket";
import {McApiSetEntityTalkBitmaskRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityTalkBitmaskRequestPacket";
import {McApiSetEntityListenBitmaskRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityListenBitmaskRequestPacket";
import {McApiSetEntityEffectBitmaskRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityEffectBitmaskRequestPacket";
import {McApiSetEntityPositionRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityPositionRequestPacket";
import {McApiSetEntityRotationRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityRotationRequestPacket";
import {McApiResetResponsePacket} from "./Network/McApiPackets/Response/McApiResetResponsePacket";
import {McApiDestroyEntityResponsePacket} from "./Network/McApiPackets/Response/McApiDestroyEntityResponsePacket";
import {McApiCreateEntityResponsePacket} from "./Network/McApiPackets/Response/McApiCreateEntityResponsePacket";
import {McApiSetEntityPropertyRequestPacket} from "./Network/McApiPackets/Request/McApiSetEntityPropertyRequestPacket";
import {McApiOnEffectUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEffectUpdatedPacket";
import {McApiOnEntityCreatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityCreatedPacket";
import {McApiOnNetworkEntityCreatedPacket} from "./Network/McApiPackets/Event/McApiOnNetworkEntityCreatedPacket";
import {McApiOnEntityDestroyedPacket} from "./Network/McApiPackets/Event/McApiOnEntityDestroyedPacket";
import {McApiOnEntityVisibilityUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityVisibilityUpdatedPacket";
import {McApiOnEntityWorldIdUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityWorldIdUpdatedPacket";
import {McApiOnEntityNameUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityNameUpdatedPacket";
import {McApiOnEntityMuteUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityMuteUpdatedPacket";
import {McApiOnEntityDeafenUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityDeafenUpdatedPacket";
import {McApiOnEntityServerMuteUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityServerMuteUpdatedPacket";
import {McApiOnEntityServerDeafenUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityServerDeafenUpdatedPacket";
import {McApiOnEntityTalkBitmaskUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityTalkBitmaskUpdatedPacket";
import {McApiOnEntityListenBitmaskUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityListenBitmaskUpdatedPacket";
import {McApiOnEntityEffectBitmaskUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityEffectBitmaskUpdatedPacket";
import {McApiOnEntityPositionUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityPositionUpdatedPacket";
import {McApiOnEntityRotationUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityRotationUpdatedPacket";
import {McApiOnEntityPropertyUpdatedPacket} from "./Network/McApiPackets/Event/McApiOnEntityPropertyUpdatedPacket";
import {McApiOnEntityAudioReceivedPacket} from "./Network/McApiPackets/Event/McApiOnEntityAudioReceivedPacket";
import {McApiOnEntityAudioDataReceivedPacket} from "./Network/McApiPackets/Event/McApiOnEntityAudioDataReceivedPacket";

export class VoiceCraft {
    public static readonly Version: Version = new Version(1, 7, 0);
    public static readonly Namespace: string = "voicecraft";

    private _writer: NetDataWriter = new NetDataWriter();
    private _reader: NetDataReader = new NetDataReader();
    private _connectionState: McApiConnectionState = McApiConnectionState.Disconnected; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
    private _token?: string;

    constructor(private _internal: boolean = false) {
        if (!this._internal) {
            system.afterEvents.scriptEventReceive.subscribe((ev) => this.HandleScriptEvent(ev));
        }
    }

    //Properties
    public get ConnectionState(): McApiConnectionState {
        return this._connectionState;
    }

    public get Token(): string | undefined {
        return this._token;
    }

    //Events
    public readonly OnConnected: Event<string> = new Event<string>();
    public readonly OnDisconnected: Event<string> = new Event<string>();
    public readonly OnPlayerBind: Event<{ playerId: string, entityId: string }> = new Event<{ playerId: string, entityId: string }>();
    public readonly OnPlayerUnbind: Event<{ playerId: string, entityId: string }> = new Event<{ playerId: string, entityId: string }>();
    public readonly OnPacket: Event<IMcApiPacket> = new Event<IMcApiPacket>();

    //McApi
    //Core
    //Requests
    public readonly OnLoginRequestPacket: Event<McApiLoginRequestPacket> = new Event<McApiLoginRequestPacket>();
    public readonly OnLogoutRequestPacket: Event<McApiLogoutRequestPacket> = new Event<McApiLogoutRequestPacket>();
    public readonly OnPingRequestPacket: Event<McApiPingRequestPacket> = new Event<McApiPingRequestPacket>();

    //Responses
    public readonly OnAcceptResponsePacket: Event<McApiAcceptResponsePacket> = new Event<McApiAcceptResponsePacket>();
    public readonly OnDenyResponsePacket: Event<McApiDenyResponsePacket> = new Event<McApiDenyResponsePacket>();
    public readonly OnPingResponsePacket: Event<McApiPingResponsePacket> = new Event<McApiPingResponsePacket>();

    //Requests
    public readonly OnEventRequestPacket: Event<McApiEventRequestPacket> = new Event<McApiEventRequestPacket>();
    public readonly OnResetRequestPacket: Event<McApiResetRequestPacket> = new Event<McApiResetRequestPacket>();
    public readonly OnSetEffectRequestPacket: Event<McApiSetEffectRequestPacket> = new Event<McApiSetEffectRequestPacket>();
    public readonly OnClearEffectsRequestPacket: Event<McApiClearEffectsRequestPacket> = new Event<McApiClearEffectsRequestPacket>();
    public readonly OnCreateEntityRequestPacket: Event<McApiCreateEntityRequestPacket> = new Event<McApiCreateEntityRequestPacket>();
    public readonly OnDestroyEntityRequestPacket: Event<McApiDestroyEntityRequestPacket> = new Event<McApiDestroyEntityRequestPacket>();
    public readonly OnEntityAudioRequestPacket: Event<McApiEntityAudioRequestPacket> = new Event<McApiEntityAudioRequestPacket>();
    public readonly OnSetEntityTitleRequestPacket: Event<McApiSetEntityTitleRequestPacket> = new Event<McApiSetEntityTitleRequestPacket>();
    public readonly OnSetEntityDescriptionRequestPacket: Event<McApiSetEntityDescriptionRequestPacket> = new Event<McApiSetEntityDescriptionRequestPacket>();
    public readonly OnSetEntityWorldIdRequestPacket: Event<McApiSetEntityWorldIdRequestPacket> = new Event<McApiSetEntityWorldIdRequestPacket>();
    public readonly OnSetEntityNameRequestPacket: Event<McApiSetEntityNameRequestPacket> = new Event<McApiSetEntityNameRequestPacket>();
    public readonly OnSetEntityMuteRequestPacket: Event<McApiSetEntityMuteRequestPacket> = new Event<McApiSetEntityMuteRequestPacket>();
    public readonly OnSetEntityDeafenRequestPacket: Event<McApiSetEntityDeafenRequestPacket> = new Event<McApiSetEntityDeafenRequestPacket>();
    public readonly OnSetEntityTalkBitmaskRequestPacket: Event<McApiSetEntityTalkBitmaskRequestPacket> = new Event<McApiSetEntityTalkBitmaskRequestPacket>();
    public readonly OnSetEntityListenBitmaskRequestPacket: Event<McApiSetEntityListenBitmaskRequestPacket> = new Event<McApiSetEntityListenBitmaskRequestPacket>();
    public readonly OnSetEntityEffectBitmaskRequestPacket: Event<McApiSetEntityEffectBitmaskRequestPacket> = new Event<McApiSetEntityEffectBitmaskRequestPacket>();
    public readonly OnSetEntityPositionRequestPacket: Event<McApiSetEntityPositionRequestPacket> = new Event<McApiSetEntityPositionRequestPacket>();
    public readonly OnSetEntityRotationRequestPacket: Event<McApiSetEntityRotationRequestPacket> = new Event<McApiSetEntityRotationRequestPacket>();
    public readonly OnSetEntityPropertyRequestPacket: Event<McApiSetEntityPropertyRequestPacket> = new Event<McApiSetEntityPropertyRequestPacket>();

    //Responses
    public readonly OnResetResponsePacket: Event<McApiResetResponsePacket> = new Event<McApiResetResponsePacket>();
    public readonly OnCreateEntityResponsePacket: Event<McApiCreateEntityResponsePacket> = new Event<McApiCreateEntityResponsePacket>();
    public readonly OnDestroyEntityResponsePacket: Event<McApiDestroyEntityResponsePacket> = new Event<McApiDestroyEntityResponsePacket>();

    //Event Packets
    public readonly OnEffectUpdatedPacket: Event<McApiOnEffectUpdatedPacket> = new Event<McApiOnEffectUpdatedPacket>();
    public readonly OnEntityCreatedPacket: Event<McApiOnEntityCreatedPacket> = new Event<McApiOnEntityCreatedPacket>();
    public readonly OnNetworkEntityCreatedPacket: Event<McApiOnNetworkEntityCreatedPacket> = new Event<McApiOnNetworkEntityCreatedPacket>();
    public readonly OnEntityDestroyedPacket: Event<McApiOnEntityDestroyedPacket> = new Event<McApiOnEntityDestroyedPacket>();
    public readonly OnEntityVisibilityUpdatedPacket: Event<McApiOnEntityVisibilityUpdatedPacket> = new Event<McApiOnEntityVisibilityUpdatedPacket>();
    public readonly OnEntityWorldIdUpdatedPacket: Event<McApiOnEntityWorldIdUpdatedPacket> = new Event<McApiOnEntityWorldIdUpdatedPacket>();
    public readonly OnEntityNameUpdatedPacket: Event<McApiOnEntityNameUpdatedPacket> = new Event<McApiOnEntityNameUpdatedPacket>();
    public readonly OnEntityMuteUpdatedPacket: Event<McApiOnEntityMuteUpdatedPacket> = new Event<McApiOnEntityMuteUpdatedPacket>();
    public readonly OnEntityDeafenUpdatedPacket: Event<McApiOnEntityDeafenUpdatedPacket> = new Event<McApiOnEntityDeafenUpdatedPacket>();
    public readonly OnEntityServerMuteUpdatedPacket: Event<McApiOnEntityServerMuteUpdatedPacket> = new Event<McApiOnEntityServerMuteUpdatedPacket>();
    public readonly OnEntityServerDeafenUpdatedPacket: Event<McApiOnEntityServerDeafenUpdatedPacket> = new Event<McApiOnEntityServerDeafenUpdatedPacket>();
    public readonly OnEntityTalkBitmaskUpdatedPacket: Event<McApiOnEntityTalkBitmaskUpdatedPacket> = new Event<McApiOnEntityTalkBitmaskUpdatedPacket>();
    public readonly OnEntityListenBitmaskUpdatedPacket: Event<McApiOnEntityListenBitmaskUpdatedPacket> = new Event<McApiOnEntityListenBitmaskUpdatedPacket>();
    public readonly OnEntityEffectBitmaskUpdatedPacket: Event<McApiOnEntityEffectBitmaskUpdatedPacket> = new Event<McApiOnEntityEffectBitmaskUpdatedPacket>();
    public readonly OnEntityPositionUpdatedPacket: Event<McApiOnEntityPositionUpdatedPacket> = new Event<McApiOnEntityPositionUpdatedPacket>();
    public readonly OnEntityRotationUpdatedPacket: Event<McApiOnEntityRotationUpdatedPacket> = new Event<McApiOnEntityRotationUpdatedPacket>();
    public readonly OnEntityPropertyUpdatedPacket: Event<McApiOnEntityPropertyUpdatedPacket> = new Event<McApiOnEntityPropertyUpdatedPacket>();
    public readonly OnEntityAudioReceivedPacket: Event<McApiOnEntityAudioReceivedPacket> = new Event<McApiOnEntityAudioReceivedPacket>();
    public readonly OnEntityAudioDataReceivedPacket: Event<McApiOnEntityAudioDataReceivedPacket> = new Event<McApiOnEntityAudioDataReceivedPacket>();

    public SendPacket(packet: IMcApiPacket) {
        if(this._internal)
            throw new Error("VoiceCraft instance set to internal! Use the base McApi socket to send packets!");
        if (this._connectionState !== McApiConnectionState.Connected)
            throw new Error("Not connected!");

        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        packet.Serialize(this._writer); //Serialize

        const packetData = Z85.GetStringWithPadding(this._writer.Data.subarray(0, this._writer.Length));
        if (packetData.length <= 0) return;
        system.sendScriptEvent(`${VoiceCraft.Namespace}:sendPacket`, packetData);
    }

    public HandlePacket(reader: NetDataReader, onParsed: (packet: IMcApiPacket) => void) {
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

    private HandleScriptEvent(ev: ScriptEventCommandMessageAfterEvent) {
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

    private HandleOnPacketEvent(packet: string) {
        const packetData = Z85.GetBytesWithPadding(packet);
        if (packetData.length <= 0) return;

        this._reader.SetBufferSource(packetData);
        this.HandlePacket(this._reader, this.ExecutePacket);
    }

    private HandleOnConnectedEvent(token: string) {
        this._token = token;
        this._connectionState = McApiConnectionState.Connected;
        this.OnConnected.Invoke(token);
    }

    private HandleOnDisconnectedEvent(reason: string) {
        this._token = undefined;
        this._connectionState = McApiConnectionState.Disconnected;
        this.OnDisconnected.Invoke(reason);
    }

    private HandleOnPlayerBindEvent(data: string) {
        const splitData = data.split(":");
        this.OnPlayerBind.Invoke({playerId: splitData[0], entityId: splitData[1]});
    }

    private HandleOnPlayerUnbindEvent(data: string) {
        const splitData = data.split(":");
        this.OnPlayerUnbind.Invoke({playerId: splitData[0], entityId: splitData[1]});
    }

    private ExecutePacket(packet: IMcApiPacket) {
        switch (packet.constructor) {
            case McApiLoginRequestPacket:
                this.HandleLoginRequestPacket(packet as McApiLoginRequestPacket);
                break;
            case McApiLogoutRequestPacket:
                this.HandleLogoutRequestPacket(packet as McApiLogoutRequestPacket);
                break;
            case McApiPingRequestPacket:
                this.HandlePingRequestPacket(packet as McApiPingRequestPacket);
                break;
            case McApiAcceptResponsePacket:
                this.HandleAcceptResponsePacket(packet as McApiAcceptResponsePacket);
                break;
            case McApiDenyResponsePacket:
                this.HandleDenyResponsePacket(packet as McApiDenyResponsePacket);
                break;
            case McApiPingResponsePacket:
                this.HandlePingResponsePacket(packet as McApiPingResponsePacket);
                break;
            case McApiEventRequestPacket:
                this.HandleEventRequestPacket(packet as McApiEventRequestPacket);
                break;
            case McApiResetRequestPacket:
                this.HandleResetRequestPacket(packet as McApiResetRequestPacket);
                break;
            case McApiSetEffectRequestPacket:
                this.HandleSetEffectRequestPacket(packet as McApiSetEffectRequestPacket);
                break;
            case McApiClearEffectsRequestPacket:
                this.HandleClearEffectsRequestPacket(packet as McApiClearEffectsRequestPacket);
                break;
            case McApiCreateEntityRequestPacket:
                this.HandleCreateEntityRequestPacket(packet as McApiCreateEntityRequestPacket);
                break;
            case McApiDestroyEntityRequestPacket:
                this.HandleDestroyEntityRequestPacket(packet as McApiDestroyEntityRequestPacket);
                break;
            case McApiEntityAudioRequestPacket:
                this.HandleEntityAudioRequestPacket(packet as McApiEntityAudioRequestPacket);
                break;
            case McApiSetEntityTitleRequestPacket:
                this.HandleSetEntityTitleRequestPacket(packet as McApiSetEntityTitleRequestPacket);
                break;
            case McApiSetEntityDescriptionRequestPacket:
                this.HandleSetEntityDescriptionRequestPacket(packet as McApiSetEntityDescriptionRequestPacket);
                break;
            case McApiSetEntityWorldIdRequestPacket:
                this.HandleSetEntityWorldIdRequestPacket(packet as McApiSetEntityWorldIdRequestPacket);
                break;
            case McApiSetEntityNameRequestPacket:
                this.HandleSetEntityNameRequestPacket(packet as McApiSetEntityNameRequestPacket);
                break;
            case McApiSetEntityMuteRequestPacket:
                this.HandleSetEntityMuteRequestPacket(packet as McApiSetEntityMuteRequestPacket);
                break;
            case McApiSetEntityDeafenRequestPacket:
                this.HandleSetEntityDeafenRequestPacket(packet as McApiSetEntityDeafenRequestPacket);
                break;
            case McApiSetEntityTalkBitmaskRequestPacket:
                this.HandleSetEntityTalkBitmaskRequestPacket(packet as McApiSetEntityTalkBitmaskRequestPacket);
                break;
            case McApiSetEntityListenBitmaskRequestPacket:
                this.HandleSetEntityListenBitmaskRequestPacket(packet as McApiSetEntityListenBitmaskRequestPacket);
                break;
            case McApiSetEntityEffectBitmaskRequestPacket:
                this.HandleSetEntityEffectBitmaskRequestPacket(packet as McApiSetEntityEffectBitmaskRequestPacket);
                break;
            case McApiSetEntityPositionRequestPacket:
                this.HandleSetEntityPositionRequestPacket(packet as McApiSetEntityPositionRequestPacket);
                break;
            case McApiSetEntityRotationRequestPacket:
                this.HandleSetEntityRotationRequestPacket(packet as McApiSetEntityRotationRequestPacket);
                break;
            case McApiSetEntityPropertyRequestPacket:
                this.HandleSetEntityPropertyRequestPacket(packet as McApiSetEntityPropertyRequestPacket);
                break;
            case McApiResetResponsePacket:
                this.HandleResetResponsePacket(packet as McApiResetResponsePacket);
                break;
            case McApiCreateEntityResponsePacket:
                this.HandleCreateEntityResponsePacket(packet as McApiCreateEntityResponsePacket);
                break;
            case McApiDestroyEntityResponsePacket:
                this.HandleDestroyEntityResponsePacket(packet as McApiDestroyEntityResponsePacket);
                break;
        }
    }

    //Packet Handling
    private HandleLoginRequestPacket(packet: McApiLoginRequestPacket) {
        this.OnLoginRequestPacket.Invoke(packet);
    }

    private HandleLogoutRequestPacket(packet: McApiLogoutRequestPacket) {
        this.OnLogoutRequestPacket.Invoke(packet);
    }

    private HandlePingRequestPacket(packet: McApiPingRequestPacket) {
        this.OnPingRequestPacket.Invoke(packet);
    }

    private HandleAcceptResponsePacket(packet: McApiAcceptResponsePacket) {
        this.OnAcceptResponsePacket.Invoke(packet);
    }

    private HandleDenyResponsePacket(packet: McApiDenyResponsePacket) {
        this.OnDenyResponsePacket.Invoke(packet);
    }

    private HandlePingResponsePacket(packet: McApiPingResponsePacket) {
        this.OnPingResponsePacket.Invoke(packet);
    }

    private HandleEventRequestPacket(packet: McApiEventRequestPacket) {
        this.OnEventRequestPacket.Invoke(packet);

        switch (packet.Event?.constructor) {
            case McApiOnEffectUpdatedPacket:
                this.HandleOnEffectUpdatedPacket(packet.Event as McApiOnEffectUpdatedPacket);
                break;
            case McApiOnEntityCreatedPacket:
                this.HandleOnEntityCreatedPacket(packet.Event as McApiOnEntityCreatedPacket);
                break;
            case McApiOnNetworkEntityCreatedPacket:
                this.HandleOnNetworkEntityCreatedPacket(packet.Event as McApiOnNetworkEntityCreatedPacket);
                break;
            case McApiOnEntityDestroyedPacket:
                this.HandleOnEntityDestroyedPacket(packet.Event as McApiOnEntityDestroyedPacket);
                break;
            case McApiOnEntityVisibilityUpdatedPacket:
                this.HandleOnEntityVisibilityUpdatedPacket(packet.Event as McApiOnEntityVisibilityUpdatedPacket);
                break;
            case McApiOnEntityWorldIdUpdatedPacket:
                this.HandleOnEntityWorldIdUpdatedPacket(packet.Event as McApiOnEntityWorldIdUpdatedPacket);
                break;
            case McApiOnEntityNameUpdatedPacket:
                this.HandleOnEntityNameUpdatedPacket(packet.Event as McApiOnEntityNameUpdatedPacket);
                break;
            case McApiOnEntityMuteUpdatedPacket:
                this.HandleOnEntityMuteUpdatedPacket(packet.Event as McApiOnEntityMuteUpdatedPacket);
                break;
            case McApiOnEntityDeafenUpdatedPacket:
                this.HandleOnEntityDeafenUpdatedPacket(packet.Event as McApiOnEntityDeafenUpdatedPacket);
                break;
            case McApiOnEntityServerMuteUpdatedPacket:
                this.HandleOnEntityServerMuteUpdatedPacket(packet.Event as McApiOnEntityServerMuteUpdatedPacket);
                break;
            case McApiOnEntityServerDeafenUpdatedPacket:
                this.HandleOnEntityServerDeafenUpdatedPacket(packet.Event as McApiOnEntityServerDeafenUpdatedPacket);
                break;
            case McApiOnEntityTalkBitmaskUpdatedPacket:
                this.HandleOnEntityTalkBitmaskUpdatedPacket(packet.Event as McApiOnEntityTalkBitmaskUpdatedPacket);
                break;
            case McApiOnEntityListenBitmaskUpdatedPacket:
                this.HandleOnEntityListenBitmaskUpdatedPacket(packet.Event as McApiOnEntityListenBitmaskUpdatedPacket);
                break;
            case McApiOnEntityEffectBitmaskUpdatedPacket:
                this.HandleOnEntityEffectBitmaskUpdatedPacket(packet.Event as McApiOnEntityEffectBitmaskUpdatedPacket);
                break;
            case McApiOnEntityPositionUpdatedPacket:
                this.HandleOnEntityPositionUpdatedPacket(packet.Event as McApiOnEntityPositionUpdatedPacket);
                break;
            case McApiOnEntityRotationUpdatedPacket:
                this.HandleOnEntityRotationUpdatedPacket(packet.Event as McApiOnEntityRotationUpdatedPacket);
                break;
            case McApiOnEntityPropertyUpdatedPacket:
                this.HandleOnEntityPropertyUpdatedPacket(packet.Event as McApiOnEntityPropertyUpdatedPacket);
                break;
            case McApiOnEntityAudioReceivedPacket:
                this.HandleOnEntityAudioReceivedPacket(packet.Event as McApiOnEntityAudioReceivedPacket);
                break;
            case McApiOnEntityAudioDataReceivedPacket:
                this.HandleOnEntityAudioDataReceivedPacket(packet.Event as McApiOnEntityAudioDataReceivedPacket);
                break;
        }
    }

    private HandleResetRequestPacket(packet: McApiResetRequestPacket) {
        this.OnResetRequestPacket.Invoke(packet);
    }

    private HandleSetEffectRequestPacket(packet: McApiSetEffectRequestPacket) {
        this.OnSetEffectRequestPacket.Invoke(packet);
    }

    private HandleClearEffectsRequestPacket(packet: McApiClearEffectsRequestPacket) {
        this.OnClearEffectsRequestPacket.Invoke(packet);
    }

    private HandleCreateEntityRequestPacket(packet: McApiCreateEntityRequestPacket) {
        this.OnCreateEntityRequestPacket.Invoke(packet);
    }

    private HandleDestroyEntityRequestPacket(packet: McApiDestroyEntityRequestPacket) {
        this.OnDestroyEntityRequestPacket.Invoke(packet);
    }

    private HandleEntityAudioRequestPacket(packet: McApiEntityAudioRequestPacket) {
        this.OnEntityAudioRequestPacket.Invoke(packet);
    }

    private HandleSetEntityTitleRequestPacket(packet: McApiSetEntityTitleRequestPacket) {
        this.OnSetEntityTitleRequestPacket.Invoke(packet);
    }

    private HandleSetEntityDescriptionRequestPacket(packet: McApiSetEntityDescriptionRequestPacket) {
        this.OnSetEntityDescriptionRequestPacket.Invoke(packet);
    }

    private HandleSetEntityWorldIdRequestPacket(packet: McApiSetEntityWorldIdRequestPacket) {
        this.OnSetEntityWorldIdRequestPacket.Invoke(packet);
    }

    private HandleSetEntityNameRequestPacket(packet: McApiSetEntityNameRequestPacket) {
        this.OnSetEntityNameRequestPacket.Invoke(packet);
    }

    private HandleSetEntityMuteRequestPacket(packet: McApiSetEntityMuteRequestPacket) {
        this.OnSetEntityMuteRequestPacket.Invoke(packet);
    }

    private HandleSetEntityDeafenRequestPacket(packet: McApiSetEntityDeafenRequestPacket) {
        this.OnSetEntityDeafenRequestPacket.Invoke(packet);
    }

    private HandleSetEntityTalkBitmaskRequestPacket(packet: McApiSetEntityTalkBitmaskRequestPacket) {
        this.OnSetEntityTalkBitmaskRequestPacket.Invoke(packet);
    }

    private HandleSetEntityListenBitmaskRequestPacket(packet: McApiSetEntityListenBitmaskRequestPacket) {
        this.OnSetEntityListenBitmaskRequestPacket.Invoke(packet);
    }

    private HandleSetEntityEffectBitmaskRequestPacket(packet: McApiSetEntityEffectBitmaskRequestPacket) {
        this.OnSetEntityEffectBitmaskRequestPacket.Invoke(packet);
    }

    private HandleSetEntityPositionRequestPacket(packet: McApiSetEntityPositionRequestPacket) {
        this.OnSetEntityPositionRequestPacket.Invoke(packet);
    }

    private HandleSetEntityRotationRequestPacket(packet: McApiSetEntityRotationRequestPacket) {
        this.OnSetEntityRotationRequestPacket.Invoke(packet);
    }

    private HandleSetEntityPropertyRequestPacket(packet: McApiSetEntityPropertyRequestPacket) {
        this.OnSetEntityPropertyRequestPacket.Invoke(packet);
    }

    private HandleResetResponsePacket(packet: McApiResetResponsePacket) {
        this.OnResetResponsePacket.Invoke(packet);
    }

    private HandleCreateEntityResponsePacket(packet: McApiCreateEntityResponsePacket) {
        this.OnCreateEntityResponsePacket.Invoke(packet);
    }

    private HandleDestroyEntityResponsePacket(packet: McApiDestroyEntityResponsePacket) {
        this.OnDestroyEntityResponsePacket.Invoke(packet);
    }

    //Event Handling
    private HandleOnEffectUpdatedPacket(packet: McApiOnEffectUpdatedPacket) {
        this.OnEffectUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityCreatedPacket(packet: McApiOnEntityCreatedPacket) {
        this.OnEntityCreatedPacket.Invoke(packet);
    }

    private HandleOnNetworkEntityCreatedPacket(packet: McApiOnNetworkEntityCreatedPacket) {
        this.OnNetworkEntityCreatedPacket.Invoke(packet);
    }

    private HandleOnEntityDestroyedPacket(packet: McApiOnEntityDestroyedPacket) {
        this.OnEntityDestroyedPacket.Invoke(packet);
    }

    private HandleOnEntityVisibilityUpdatedPacket(packet: McApiOnEntityVisibilityUpdatedPacket) {
        this.OnEntityVisibilityUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityWorldIdUpdatedPacket(packet: McApiOnEntityWorldIdUpdatedPacket) {
        this.OnEntityWorldIdUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityNameUpdatedPacket(packet: McApiOnEntityNameUpdatedPacket) {
        this.OnEntityNameUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityMuteUpdatedPacket(packet: McApiOnEntityMuteUpdatedPacket) {
        this.OnEntityMuteUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityDeafenUpdatedPacket(packet: McApiOnEntityDeafenUpdatedPacket) {
        this.OnEntityDeafenUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityServerMuteUpdatedPacket(packet: McApiOnEntityServerMuteUpdatedPacket) {
        this.OnEntityServerMuteUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityServerDeafenUpdatedPacket(packet: McApiOnEntityServerDeafenUpdatedPacket) {
        this.OnEntityServerDeafenUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityTalkBitmaskUpdatedPacket(packet: McApiOnEntityTalkBitmaskUpdatedPacket) {
        this.OnEntityTalkBitmaskUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityListenBitmaskUpdatedPacket(packet: McApiOnEntityListenBitmaskUpdatedPacket) {
        this.OnEntityListenBitmaskUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityEffectBitmaskUpdatedPacket(packet: McApiOnEntityEffectBitmaskUpdatedPacket) {
        this.OnEntityEffectBitmaskUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityPositionUpdatedPacket(packet: McApiOnEntityPositionUpdatedPacket) {
        this.OnEntityPositionUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityRotationUpdatedPacket(packet: McApiOnEntityRotationUpdatedPacket) {
        this.OnEntityRotationUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityPropertyUpdatedPacket(packet: McApiOnEntityPropertyUpdatedPacket) {
        this.OnEntityPropertyUpdatedPacket.Invoke(packet);
    }

    private HandleOnEntityAudioReceivedPacket(packet: McApiOnEntityAudioReceivedPacket) {
        this.OnEntityAudioReceivedPacket.Invoke(packet);
    }

    private HandleOnEntityAudioDataReceivedPacket(packet: McApiOnEntityAudioDataReceivedPacket) {
        this.OnEntityAudioDataReceivedPacket.Invoke(packet);
    }

    private ProcessPacket(reader: NetDataReader, onParsed: (packet: IMcApiPacket) => void, packetFactory: () => IMcApiPacket) {
        const packet = packetFactory();
        packet.Deserialize(reader);
        this.OnPacket.Invoke(packet);
        onParsed(packet);
    }
}
