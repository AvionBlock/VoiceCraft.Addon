import { system } from "@minecraft/server";
import { Z85 } from "./Encoders/Z85";
import { McApiPacketType } from "./Data/Enums";
import { NetDataReader } from "./Network/NetDataReader";
import { McApiAcceptPacket } from "./Network/Packets/McApiAcceptPacket";
import { McApiDenyPacket } from "./Network/Packets/McApiDenyPacket";
import { McApiPingPacket } from "./Network/Packets/McApiPingPacket";
import { Event } from "./Event";
import { NetDataWriter } from "./Network/NetDataWriter";
import { McApiEntityCreatedPacket } from "./Network/Packets/McApiEntityCreatedPacket";
import { McApiNetworkEntityCreatedPacket } from "./Network/Packets/McApiNetworkEntityCreatedPacket";
export class VoiceCraft {
    static Namespace = "voicecraft";
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    constructor() {
        system.afterEvents.scriptEventReceive.subscribe((ev) => this.HandleScriptEventAsync(ev));
    }
    //Events
    OnAcceptPacket = new Event();
    OnDenyPacket = new Event();
    OnPingPacket = new Event();
    //McApi
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
        if (!(packetType in McApiPacketType))
            return; //Not a valid packet.
        await this.HandlePacketAsync(packetType, this._reader);
    }
    async HandlePacketAsync(packetType, reader) {
        switch (packetType) {
            case McApiPacketType.Accept:
                const acceptPacket = new McApiAcceptPacket();
                acceptPacket.Deserialize(reader);
                this.HandleAcceptPacket(acceptPacket);
                break;
            case McApiPacketType.Deny:
                const denyPacket = new McApiDenyPacket();
                denyPacket.Deserialize(reader);
                this.HandleDenyPacket(denyPacket);
                break;
            case McApiPacketType.Ping:
                const pingPacket = new McApiPingPacket();
                pingPacket.Deserialize(reader);
                this.HandlePingPacket(pingPacket);
                break;
            case McApiPacketType.EntityCreated:
                const entityCreatedPacket = new McApiEntityCreatedPacket();
                entityCreatedPacket.Deserialize(reader);
                this.HandleEntityCreatedPacket(entityCreatedPacket);
                break;
            case McApiPacketType.NetworkEntityCreated:
                const networkEntityCreatedPacket = new McApiNetworkEntityCreatedPacket();
                networkEntityCreatedPacket.Deserialize(reader);
                this.HandleNetworkEntityCreatedPacket(networkEntityCreatedPacket);
                break;
        }
    }
    HandleAcceptPacket(packet) {
        this.OnAcceptPacket.Invoke(packet);
    }
    HandleDenyPacket(packet) {
        this.OnDenyPacket.Invoke(packet);
    }
    HandlePingPacket(packet) {
        this.OnPingPacket.Invoke(packet);
    }
    HandleEntityCreatedPacket(packet) {
        console.log(JSON.stringify(packet));
    }
    HandleNetworkEntityCreatedPacket(packet) {
        console.log(JSON.stringify(packet));
    }
}
