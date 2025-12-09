import { system } from "@minecraft/server";
import { Z85 } from "./Encoders/Z85";
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
    //McApi
    OnPacket = new Event();
    //Requests
    OnLoginRequestPacket = new Event();
    OnLogoutRequestPacket = new Event();
    OnPingRequestPacket = new Event();
    OnSetEntityTitleRequestPacket = new Event();
    OnSetEntityDescriptionRequestPacket = new Event();
    //Response
    OnAcceptResponsePacket = new Event();
    OnDenyResponsePacket = new Event();
    OnPingResponsePacket = new Event();
    //Events
    OnEntityCreatedPacket = new Event();
    OnNetworkEntityCreatedPacket = new Event();
    OnEntityDestroyedPacket = new Event();
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
        if (packetType < 0 /* McApiPacketType.LoginRequest */ || packetType > 23 /* McApiPacketType.OnEntityAudioReceived */)
            return; //Not a valid packet.
        await this.HandlePacketAsync(packetType, this._reader);
    }
    async HandleOnConnectedEvent(token) {
        this._token = token;
        this._connectionState = 2;
    }
    HandleOnDisconnectedEvent(reason) {
        this._token = undefined;
        this._connectionState = 0;
    }
    async HandlePacketAsync(packetType, reader) {
        switch (packetType) {
            case 0 /* McApiPacketType.LoginRequest */:
                const loginRequestPacket = new McApiLoginRequestPacket();
                loginRequestPacket.Deserialize(reader);
                this.HandleLoginRequestPacket(loginRequestPacket);
                break;
            case 1 /* McApiPacketType.LogoutRequest */:
                const logoutRequestPacket = new McApiLogoutRequestPacket();
                logoutRequestPacket.Deserialize(reader);
                this.HandleLogoutRequestPacket(logoutRequestPacket);
                break;
            case 2 /* McApiPacketType.PingRequest */:
                const pingRequestPacket = new McApiPingRequestPacket();
                pingRequestPacket.Deserialize(reader);
                this.HandlePingRequestPacket(pingRequestPacket);
                break;
            case 3 /* McApiPacketType.SetEntityTitleRequest */:
                const setEntityTitleRequestPacket = new McApiSetEntityTitleRequestPacket();
                setEntityTitleRequestPacket.Deserialize(reader);
                this.HandleSetEntityTitleRequestPacket(setEntityTitleRequestPacket);
                break;
            case 4 /* McApiPacketType.SetEntityDescriptionRequest */:
                const setEntityDescriptionRequestPacket = new McApiSetEntityDescriptionRequestPacket();
                setEntityDescriptionRequestPacket.Deserialize(reader);
                this.HandleSetEntityDescriptionRequestPacket(setEntityDescriptionRequestPacket);
                break;
            case 5 /* McApiPacketType.AcceptResponse */:
                const acceptResponsePacket = new McApiAcceptResponsePacket();
                acceptResponsePacket.Deserialize(reader);
                this.HandleAcceptResponsePacket(acceptResponsePacket);
                break;
            case 6 /* McApiPacketType.DenyResponse */:
                const denyResponsePacket = new McApiDenyResponsePacket();
                denyResponsePacket.Deserialize(reader);
                this.HandleDenyResponsePacket(denyResponsePacket);
                break;
            case 7 /* McApiPacketType.PingResponse */:
                const pingResponsePacket = new McApiPingResponsePacket();
                pingResponsePacket.Deserialize(reader);
                this.HandlePingResponsePacket(pingResponsePacket);
                break;
            case 8 /* McApiPacketType.OnEntityCreated */:
                const onEntityCreatedPacket = new McApiOnEntityCreatedPacket();
                onEntityCreatedPacket.Deserialize(reader);
                this.HandleOnEntityCreatedPacket(onEntityCreatedPacket);
                break;
            case 9 /* McApiPacketType.OnNetworkEntityCreated */:
                const onNetworkEntityCreatedPacket = new McApiOnNetworkEntityCreatedPacket();
                onNetworkEntityCreatedPacket.Deserialize(reader);
                this.HandleOnNetworkEntityCreatedPacket(onNetworkEntityCreatedPacket);
                break;
            case 10 /* McApiPacketType.OnEntityDestroyed */:
                const onEntityDestroyedPacket = new McApiOnEntityDestroyedPacket();
                onEntityDestroyedPacket.Deserialize(reader);
                this.HandleOnEntityDestroyedPacket(onEntityDestroyedPacket);
                break;
            case 11 /* McApiPacketType.OnEntityVisibilityUpdated */:
                break;
            case 12 /* McApiPacketType.OnEntityWorldIdUpdated */:
                break;
            case 13 /* McApiPacketType.OnEntityNameUpdated */:
                break;
            case 14 /* McApiPacketType.OnEntityMuteUpdated */:
                break;
            case 15 /* McApiPacketType.OnEntityDeafenUpdated */:
                break;
            case 16 /* McApiPacketType.OnEntityTalkBitmaskUpdated */:
                break;
            case 17 /* McApiPacketType.OnEntityListenBitmaskUpdated */:
                break;
            case 18 /* McApiPacketType.OnEntityEffectBitmaskUpdated */:
                break;
            case 19 /* McApiPacketType.OnEntityPositionUpdated */:
                break;
            case 20 /* McApiPacketType.OnEntityRotationUpdated */:
                break;
            case 21 /* McApiPacketType.OnEntityCaveFactorUpdated */:
                break;
            case 22 /* McApiPacketType.OnEntityMuffleFactorUpdated */:
                break;
            case 23 /* McApiPacketType.OnEntityAudioReceived */:
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
    HandleSetEntityTitleRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityTitleRequestPacket.Invoke(packet);
    }
    HandleSetEntityDescriptionRequestPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnSetEntityDescriptionRequestPacket.Invoke(packet);
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
    HandleOnEntityAudioReceivedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityAudioReceivedPacket.Invoke(packet);
    }
}
