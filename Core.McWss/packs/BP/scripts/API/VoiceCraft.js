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
export class VoiceCraft {
    static Namespace = "voicecraft";
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    constructor() {
        system.afterEvents.scriptEventReceive.subscribe((ev) => this.HandleScriptEventAsync(ev));
    }
    //Events
    //McApi
    OnPacket = new Event();
    //Requests
    OnLoginRequestPacket = new Event();
    OnLogoutRequestPacket = new Event();
    OnPingRequestPacket = new Event();
    //Response
    OnAcceptResponsePacket = new Event();
    OnDenyResponsePacket = new Event();
    OnPingResponsePacket = new Event();
    //Events
    OnEntityAudioReceivedPacket = new Event();
    async HandleScriptEventAsync(ev) {
        switch (ev.id) {
            case `${VoiceCraft.Namespace}:onPacket`:
                await this.HandleOnPacketEventAsync(ev.message);
                break;
        }
    }
    async HandleOnPacketEventAsync(packet) {
        const packetData = Z85.GetBytesWithPadding(packet);
        if (packetData.length <= 0)
            return;
        this._reader.SetBufferSource(packetData);
        const packetType = this._reader.GetByte();
        if (packetType < 0 /* McApiPacketType.LoginRequest */ || packetType > 21 /* McApiPacketType.OnEntityAudioReceived */)
            return; //Not a valid packet.
        await this.HandlePacketAsync(packetType, this._reader);
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
            case 3 /* McApiPacketType.AcceptResponse */:
                const acceptResponsePacket = new McApiAcceptResponsePacket();
                acceptResponsePacket.Deserialize(reader);
                this.HandleAcceptResponsePacket(acceptResponsePacket);
                break;
            case 4 /* McApiPacketType.DenyResponse */:
                const denyResponsePacket = new McApiDenyResponsePacket();
                denyResponsePacket.Deserialize(reader);
                this.HandleDenyResponsePacket(denyResponsePacket);
                break;
            case 5 /* McApiPacketType.PingResponse */:
                const pingResponsePacket = new McApiPingResponsePacket();
                pingResponsePacket.Deserialize(reader);
                this.HandlePingResponsePacket(pingResponsePacket);
                break;
            case 6 /* McApiPacketType.OnEntityCreated */:
                break;
            case 7 /* McApiPacketType.OnNetworkEntityCreated */:
                break;
            case 8 /* McApiPacketType.OnEntityDestroyed */:
                break;
            case 9 /* McApiPacketType.OnEntityVisibilityUpdated */:
                break;
            case 10 /* McApiPacketType.OnEntityWorldIdUpdated */:
                break;
            case 11 /* McApiPacketType.OnEntityNameUpdated */:
                break;
            case 12 /* McApiPacketType.OnEntityMuteUpdated */:
                break;
            case 13 /* McApiPacketType.OnEntityDeafenUpdated */:
                break;
            case 14 /* McApiPacketType.OnEntityTalkBitmaskUpdated */:
                break;
            case 15 /* McApiPacketType.OnEntityListenBitmaskUpdated */:
                break;
            case 16 /* McApiPacketType.OnEntityEffectBitmaskUpdated */:
                break;
            case 17 /* McApiPacketType.OnEntityPositionUpdated */:
                break;
            case 18 /* McApiPacketType.OnEntityRotationUpdated */:
                break;
            case 19 /* McApiPacketType.OnEntityCaveFactorUpdated */:
                break;
            case 20 /* McApiPacketType.OnEntityMuffleFactorUpdated */:
                break;
            case 21 /* McApiPacketType.OnEntityAudioReceived */:
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
    HandleOnEntityAudioReceivedPacket(packet) {
        this.OnPacket.Invoke(packet);
        this.OnEntityAudioReceivedPacket.Invoke(packet);
    }
}
