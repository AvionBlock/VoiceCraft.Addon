import { McApiAcceptPacket } from "./Network/Packets/McApiAcceptPacket";
import { McApiDenyPacket } from "./Network/Packets/McApiDenyPacket";
import { McApiPingPacket } from "./Network/Packets/McApiPingPacket";
import { Event } from "./Event";
import { McApiEntityCreatedPacket } from "./Network/Packets/McApiEntityCreatedPacket";
import { McApiNetworkEntityCreatedPacket } from "./Network/Packets/McApiNetworkEntityCreatedPacket";
export declare class VoiceCraft {
    static readonly Namespace: string;
    private _writer;
    private _reader;
    constructor();
    readonly OnAcceptPacket: Event<McApiAcceptPacket>;
    readonly OnDenyPacket: Event<McApiDenyPacket>;
    readonly OnPingPacket: Event<McApiPingPacket>;
    private HandleScriptEventAsync;
    private HandleOnPacketEventAsync;
    private HandlePacketAsync;
    HandleAcceptPacket(packet: McApiAcceptPacket): void;
    HandleDenyPacket(packet: McApiDenyPacket): void;
    HandlePingPacket(packet: McApiPingPacket): void;
    HandleEntityCreatedPacket(packet: McApiEntityCreatedPacket): void;
    HandleNetworkEntityCreatedPacket(packet: McApiNetworkEntityCreatedPacket): void;
}
