import "./Extensions";
import { McApiClient } from "./API/McApiClient";
import { IMcApiPacket } from "./API/Network/McApiPackets/IMcApiPacket";
export declare class McApiMcHttp extends McApiClient {
    private _timeoutMs;
    private _pinger;
    private _hostname;
    private _httpRequestPromise;
    private readonly _httpWriter;
    private readonly _httpReader;
    private readonly _writer;
    private readonly _reader;
    constructor();
    ConnectAsync(ip: string, _: number, loginToken: string): Promise<void>;
    Update(): void;
    DisconnectAsync(reason?: string): Promise<void>;
    SendPacket(packet: IMcApiPacket): boolean;
    private Reset;
    private SendPacketsLogic;
    private GetResponseAsync;
    private ReceivePacketsLogic;
}
