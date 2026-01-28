import "./Extensions";
import { McApiClient } from "./API/McApiClient";
import { IMcApiPacket } from "./API/Network/McApiPackets/IMcApiPacket";
export declare class McApiMcHttp extends McApiClient {
    private _cm;
    private _timeoutMs;
    private _lastPingPacket;
    private _awaitingRequest;
    private _updater;
    private _outboundQueue;
    private readonly _writer;
    private readonly _reader;
    constructor();
    ConnectAsync(ip: string, _: number, loginToken: string): Promise<void>;
    DisconnectAsync(reason?: string, force?: boolean): Promise<void>;
    SendPacket(packet: IMcApiPacket): boolean;
    private StartUpdater;
    private StopUpdater;
    private HttpUpdaterLogic;
    private SendPacketsLogic;
    private ReceivePacketsLogic;
}
