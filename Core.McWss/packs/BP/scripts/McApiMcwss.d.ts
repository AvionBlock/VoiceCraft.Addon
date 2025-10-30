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
    constructor();
    ConnectAsync(token: string): Promise<void>;
    private SendPacket;
    private RegisterRequestId;
    private DeregisterRequestId;
    private GetResponseAsync;
    private HandleScriptEvent;
}
