import { Player } from "@minecraft/server";
import { McApiPacket } from "./API/Network/Packets/McApiPacket";
import { McApiAcceptPacket } from "./API/Network/Packets/McApiAcceptPacket";
import { Event } from "./API/Event";
export declare class McApiMcwss {
    private _vc;
    private _tunnelId;
    private _version;
    private _commands;
    private _defaultTimeoutMs;
    private _source?;
    private _token?;
    private _writer;
    private _reader;
    private _lastPing;
    private _connecting;
    private _requestIds;
    OnPacket: Event<McApiPacket>;
    OnAcceptPacket: Event<McApiAcceptPacket>;
    constructor();
    ConnectAsync(source: Player, token: string): Promise<void>;
    private SendPacket;
    private RegisterRequestId;
    private DeregisterRequestId;
    private GetResponseAsync;
    private HandleScriptEvent;
    private HandlePacketAsync;
    private HandleAcceptPacket;
}
