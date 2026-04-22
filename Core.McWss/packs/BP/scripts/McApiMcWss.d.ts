import "./Extensions";
import { McApiClient } from "./API/McApiClient";
import { IMcApiPacket } from "./API/Network/McApiPackets/IMcApiPacket";
export declare class McApiMcWss extends McApiClient {
    private _timeoutMs;
    private _pinger;
    private readonly _mcWssWriter;
    private readonly _mcWssReader;
    private readonly _writer;
    private readonly _reader;
    constructor();
    ConnectAsync(_: string, __: number, loginToken: string): Promise<void>;
    Update(): void;
    DisconnectAsync(reason?: string): Promise<void>;
    SendPacket(packet: IMcApiPacket): boolean;
    private Reset;
    private GetResponseAsync;
    private HandleDataTunnelCommand;
    private SendPacketsLogic;
    private ReceivePacketsLogic;
}
