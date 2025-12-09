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
  }

  private HandleOnDisconnectedEvent(reason: string) {
    this._token = undefined;
    this._connectionState = 0;
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
        break;
      case McApiPacketType.OnEntityWorldIdUpdated:
        break;
      case McApiPacketType.OnEntityNameUpdated:
        break;
      case McApiPacketType.OnEntityMuteUpdated:
        break;
      case McApiPacketType.OnEntityDeafenUpdated:
        break;
      case McApiPacketType.OnEntityTalkBitmaskUpdated:
        break;
      case McApiPacketType.OnEntityListenBitmaskUpdated:
        break;
      case McApiPacketType.OnEntityEffectBitmaskUpdated:
        break;
      case McApiPacketType.OnEntityPositionUpdated:
        break;
      case McApiPacketType.OnEntityRotationUpdated:
        break;
      case McApiPacketType.OnEntityCaveFactorUpdated:
        break;
      case McApiPacketType.OnEntityMuffleFactorUpdated:
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

  private HandleOnEntityAudioReceivedPacket(packet: McApiOnEntityAudioReceivedPacket) {
    this.OnPacket.Invoke(packet);
    this.OnEntityAudioReceivedPacket.Invoke(packet);
  }
}
