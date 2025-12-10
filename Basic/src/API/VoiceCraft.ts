import { ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";
import { Z85 } from "./Encoders/Z85";
import { McApiPacketType } from "./Data/Enums";
import { NetDataReader } from "./Network/NetDataReader";
import { Event } from "./Event";
import { NetDataWriter } from "./Network/NetDataWriter";
import { IMcApiPacket } from "./Network/McApiPackets/IMcApiPacket";
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

export class VoiceCraft {
  public static readonly Namespace: string = "voicecraft";

  private _writer: NetDataWriter = new NetDataWriter();
  private _reader: NetDataReader = new NetDataReader();
  private _connectionState: 0 | 1 | 2 | 3 = 0; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
  private _token?: string;

  constructor() {
    system.afterEvents.scriptEventReceive.subscribe((ev) => this.HandleScriptEventAsync(ev));
  }

  //Properties
  public get ConnectionState(): 0 | 1 | 2 | 3 {
    return this._connectionState;
  }
  public get Token(): string | undefined {
    return this._token;
  }

  //Events
  public readonly OnConnected: Event<string> = new Event<string>();
  public readonly OnDisconnected: Event<string> = new Event<string>();
  //McApi
  public readonly OnPacket: Event<IMcApiPacket> = new Event<IMcApiPacket>();
  //Requests
  public readonly OnLoginRequestPacket: Event<McApiLoginRequestPacket> = new Event<McApiLoginRequestPacket>();
  public readonly OnLogoutRequestPacket: Event<McApiLogoutRequestPacket> = new Event<McApiLogoutRequestPacket>();
  public readonly OnPingRequestPacket: Event<McApiPingRequestPacket> = new Event<McApiPingRequestPacket>();
  public readonly OnSetEntityTitleRequestPacket: Event<McApiSetEntityTitleRequestPacket> =
    new Event<McApiSetEntityTitleRequestPacket>();
  public readonly OnSetEntityDescriptionRequestPacket: Event<McApiSetEntityDescriptionRequestPacket> =
    new Event<McApiSetEntityDescriptionRequestPacket>();
  public readonly OnSetEntityWorldIdRequestPacket: Event<McApiSetEntityWorldIdRequestPacket> =
    new Event<McApiSetEntityWorldIdRequestPacket>();
  public readonly OnSetEntityNameRequestPacket: Event<McApiSetEntityNameRequestPacket> =
    new Event<McApiSetEntityNameRequestPacket>();
  public readonly OnSetEntityTalkBitmaskRequestPacket: Event<McApiSetEntityTalkBitmaskRequestPacket> =
    new Event<McApiSetEntityTalkBitmaskRequestPacket>();
  public readonly OnSetEntityListenBitmaskRequestPacket: Event<McApiSetEntityListenBitmaskRequestPacket> =
    new Event<McApiSetEntityListenBitmaskRequestPacket>();
  public readonly OnSetEntityEffectBitmaskRequestPacket: Event<McApiSetEntityEffectBitmaskRequestPacket> =
    new Event<McApiSetEntityEffectBitmaskRequestPacket>();
  public readonly OnSetEntityPositionRequestPacket: Event<McApiSetEntityPositionRequestPacket> =
    new Event<McApiSetEntityPositionRequestPacket>();
  public readonly OnSetEntityRotationRequestPacket: Event<McApiSetEntityRotationRequestPacket> =
    new Event<McApiSetEntityRotationRequestPacket>();
  public readonly OnSetEntityCaveFactorRequestPacket: Event<McApiSetEntityCaveFactorRequestPacket> =
    new Event<McApiSetEntityCaveFactorRequestPacket>();
  public readonly OnSetEntityMuffleFactorRequestPacket: Event<McApiSetEntityMuffleFactorRequestPacket> =
    new Event<McApiSetEntityMuffleFactorRequestPacket>();
  //Response
  public readonly OnAcceptResponsePacket: Event<McApiAcceptResponsePacket> = new Event<McApiAcceptResponsePacket>();
  public readonly OnDenyResponsePacket: Event<McApiDenyResponsePacket> = new Event<McApiDenyResponsePacket>();
  public readonly OnPingResponsePacket: Event<McApiPingResponsePacket> = new Event<McApiPingResponsePacket>();
  //Events
  public readonly OnEntityCreatedPacket: Event<McApiOnEntityCreatedPacket> = new Event<McApiOnEntityCreatedPacket>();
  public readonly OnNetworkEntityCreatedPacket: Event<McApiOnNetworkEntityCreatedPacket> =
    new Event<McApiOnNetworkEntityCreatedPacket>();
  public readonly OnEntityDestroyedPacket: Event<McApiOnEntityDestroyedPacket> =
    new Event<McApiOnEntityDestroyedPacket>();
  public readonly OnEntityVisibilityUpdatedPacket: Event<McApiOnEntityVisibilityUpdatedPacket> =
    new Event<McApiOnEntityVisibilityUpdatedPacket>();
  public readonly OnEntityWorldIdUpdatedPacket: Event<McApiOnEntityWorldIdUpdatedPacket> =
    new Event<McApiOnEntityWorldIdUpdatedPacket>();
  public readonly OnEntityNameUpdatedPacket: Event<McApiOnEntityNameUpdatedPacket> =
    new Event<McApiOnEntityNameUpdatedPacket>();
  public readonly OnEntityMuteUpdatedPacket: Event<McApiOnEntityMuteUpdatedPacket> =
    new Event<McApiOnEntityMuteUpdatedPacket>();
  public readonly OnEntityDeafenUpdatedPacket: Event<McApiOnEntityDeafenUpdatedPacket> =
    new Event<McApiOnEntityDeafenUpdatedPacket>();
  public readonly OnEntityTalkBitmaskUpdatedPacket: Event<McApiOnEntityTalkBitmaskUpdatedPacket> =
    new Event<McApiOnEntityTalkBitmaskUpdatedPacket>();
  public readonly OnEntityListenBitmaskUpdatedPacket: Event<McApiOnEntityListenBitmaskUpdatedPacket> =
    new Event<McApiOnEntityListenBitmaskUpdatedPacket>();
  public readonly OnEntityEffectBitmaskUpdatedPacket: Event<McApiOnEntityEffectBitmaskUpdatedPacket> =
    new Event<McApiOnEntityEffectBitmaskUpdatedPacket>();
  public readonly OnEntityPositionUpdatedPacket: Event<McApiOnEntityPositionUpdatedPacket> =
    new Event<McApiOnEntityPositionUpdatedPacket>();
  public readonly OnEntityRotationUpdatedPacket: Event<McApiOnEntityRotationUpdatedPacket> =
    new Event<McApiOnEntityRotationUpdatedPacket>();
  public readonly OnEntityCaveFactorUpdatedPacket: Event<McApiOnEntityCaveFactorUpdatedPacket> =
    new Event<McApiOnEntityCaveFactorUpdatedPacket>();
  public readonly OnEntityMuffleFactorUpdatedPacket: Event<McApiOnEntityMuffleFactorUpdatedPacket> =
    new Event<McApiOnEntityMuffleFactorUpdatedPacket>();
  public readonly OnEntityAudioReceivedPacket: Event<McApiOnEntityAudioReceivedPacket> =
    new Event<McApiOnEntityAudioReceivedPacket>();

  public SendPacket(packet: IMcApiPacket) {
    if (this._connectionState !== 2) throw new Error("Not connected!");

    this._writer.Reset();
    this._writer.PutByte(packet.PacketType);
    packet.Serialize(this._writer); //Serialize

    const packetData = Z85.GetStringWithPadding(this._writer.Data.subarray(0, this._writer.Length));
    if (packetData.length <= 0) return;
    system.sendScriptEvent(`${VoiceCraft.Namespace}:sendPacket`, packetData);
  }

  private async HandleScriptEventAsync(ev: ScriptEventCommandMessageAfterEvent) {
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

  private async HandleOnPacketEventAsync(packet: string) {
    const packetData = Z85.GetBytesWithPadding(packet);
    if (packetData.length <= 0) return;

    this._reader.SetBufferSource(packetData);
    const packetType = this._reader.GetByte();
    if (packetType < McApiPacketType.LoginRequest || packetType > McApiPacketType.OnEntityAudioReceived) return; //Not a valid packet.
    await this.HandlePacketAsync(packetType as McApiPacketType, this._reader);
  }

  private async HandleOnConnectedEvent(token: string) {
    this._token = token;
    this._connectionState = 2;
    this.OnConnected.Invoke(token);
  }

  private HandleOnDisconnectedEvent(reason: string) {
    this._token = undefined;
    this._connectionState = 0;
    this.OnDisconnected.Invoke(reason);
  }

  private async HandlePacketAsync(packetType: McApiPacketType, reader: NetDataReader) {
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

  private HandleLoginRequestPacket(packet: McApiLoginRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnLoginRequestPacket.Invoke(packet);
  }

  private HandleLogoutRequestPacket(packet: McApiLogoutRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnLogoutRequestPacket.Invoke(packet);
  }

  private HandlePingRequestPacket(packet: McApiPingRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnPingRequestPacket.Invoke(packet);
  }

  private HandleSetEntityTitleRequestPacket(packet: McApiSetEntityTitleRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityTitleRequestPacket.Invoke(packet);
  }

  private HandleSetEntityDescriptionRequestPacket(packet: McApiSetEntityDescriptionRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityDescriptionRequestPacket.Invoke(packet);
  }

  private HandleSetEntityWorldIdRequestPacket(packet: McApiSetEntityWorldIdRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityWorldIdRequestPacket.Invoke(packet);
  }

  private HandleSetEntityNameRequestPacket(packet: McApiSetEntityNameRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityNameRequestPacket.Invoke(packet);
  }

  private HandleSetEntityTalkBitmaskRequestPacket(packet: McApiSetEntityTalkBitmaskRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityTalkBitmaskRequestPacket.Invoke(packet);
  }

  private HandleSetEntityListenBitmaskRequestPacket(packet: McApiSetEntityListenBitmaskRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityListenBitmaskRequestPacket.Invoke(packet);
  }

  private HandleSetEntityEffectBitmaskRequestPacket(packet: McApiSetEntityEffectBitmaskRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityEffectBitmaskRequestPacket.Invoke(packet);
  }

  private HandleSetEntityPositionRequestPacket(packet: McApiSetEntityPositionRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityPositionRequestPacket.Invoke(packet);
  }

  private HandleSetEntityRotationRequestPacket(packet: McApiSetEntityRotationRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityRotationRequestPacket.Invoke(packet);
  }

  private HandleSetEntityCaveFactorRequestPacket(packet: McApiSetEntityCaveFactorRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityCaveFactorRequestPacket.Invoke(packet);
  }

  private HandleSetEntityMuffleFactorRequestPacket(packet: McApiSetEntityMuffleFactorRequestPacket) {
    this.OnPacket.Invoke(packet);
    this.OnSetEntityMuffleFactorRequestPacket.Invoke(packet);
  }

  private HandleAcceptResponsePacket(packet: McApiAcceptResponsePacket) {
    this.OnPacket.Invoke(packet);
    this.OnAcceptResponsePacket.Invoke(packet);
  }

  private HandleDenyResponsePacket(packet: McApiDenyResponsePacket) {
    this.OnPacket.Invoke(packet);
    this.OnDenyResponsePacket.Invoke(packet);
  }

  private HandlePingResponsePacket(packet: McApiPingResponsePacket) {
    this.OnPacket.Invoke(packet);
    this.OnPingResponsePacket.Invoke(packet);
  }

  private HandleOnEntityCreatedPacket(packet: McApiOnEntityCreatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityCreatedPacket.Invoke(packet);
  }

  private HandleOnNetworkEntityCreatedPacket(packet: McApiOnNetworkEntityCreatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnNetworkEntityCreatedPacket.Invoke(packet);
  }

  private HandleOnEntityDestroyedPacket(packet: McApiOnEntityDestroyedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityDestroyedPacket.Invoke(packet);
  }

  private HandleOnEntityVisibilityUpdatedPacket(packet: McApiOnEntityVisibilityUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityVisibilityUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityWorldIdUpdatedPacket(packet: McApiOnEntityWorldIdUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityWorldIdUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityNameUpdatedPacket(packet: McApiOnEntityNameUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityNameUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityMuteUpdatedPacket(packet: McApiOnEntityMuteUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityMuteUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityDeafenUpdatedPacket(packet: McApiOnEntityDeafenUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityDeafenUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityTalkBitmaskUpdatedPacket(packet: McApiOnEntityTalkBitmaskUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityTalkBitmaskUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityListenBitmaskUpdatedPacket(packet: McApiOnEntityListenBitmaskUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityListenBitmaskUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityEffectBitmaskUpdatedPacket(packet: McApiOnEntityEffectBitmaskUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityEffectBitmaskUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityPositionUpdatedPacket(packet: McApiOnEntityPositionUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityPositionUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityRotationUpdatedPacket(packet: McApiOnEntityRotationUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityRotationUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityCaveFactorUpdatedPacket(packet: McApiOnEntityCaveFactorUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityCaveFactorUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityMuffleFactorUpdatedPacket(packet: McApiOnEntityMuffleFactorUpdatedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityMuffleFactorUpdatedPacket.Invoke(packet);
  }

  private HandleOnEntityAudioReceivedPacket(packet: McApiOnEntityAudioReceivedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityAudioReceivedPacket.Invoke(packet);
  }
}
