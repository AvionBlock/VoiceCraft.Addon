import "./Extensions";
import { McApiClient } from "./API/McApiClient";
import { IMcApiPacket } from "./API/Network/McApiPackets/IMcApiPacket";
export declare class McApiMcWss extends McApiClient {
    private _pinger;
    private readonly _mcWssWriter;
    private readonly _mcWssReader;
    private readonly _writer;
    private readonly _reader;
    private readonly _subscribedEvents;
    constructor();
    ConnectAsync(_: string, __: number, loginToken: string): Promise<void>;
    Update(): void;
    DisconnectAsync(reason?: string, force?: boolean): Promise<void>;
    SendPacket(packet: IMcApiPacket): boolean;
    private Reset;
    private HandleDataTunnelCommand;
    private SendPacketsLogic;
    private ReceivePacketsLogic;
}
