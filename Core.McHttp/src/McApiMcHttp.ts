import "./Extensions";
import {McApiClient} from "./API/McApiClient";
import {McApiConnectionState, McApiPacketType} from "./API/Data/Enums";
import {McApiLoginRequestPacket} from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import {Guid} from "./API/Data/Guid";
import {NetDataWriter} from "./API/Data/NetDataWriter";
import {IMcApiPacket} from "./API/Network/McApiPackets/IMcApiPacket";
import {system} from "@minecraft/server";
import {http, HttpHeader, HttpRequest, HttpRequestMethod, HttpResponse} from "@minecraft/server-net";
import {Z85} from "./API/Encoders/Z85";
import {McApiLogoutRequestPacket} from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import {NetDataReader} from "./API/Data/NetDataReader";
import {CommandManager} from "./Managers/CommandManager";
import {McApiPingRequestPacket} from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
import {VoiceCraft} from "./API/VoiceCraft";
import {Locales} from "./API/Locales";
import {McApiAcceptResponsePacket} from "./API/Network/McApiPackets/Response/McApiAcceptResponsePacket";
import {IMcApiRIdPacket} from "./API/Network/McApiPackets/IMcApiRIdPacket";

export class McApiMcHttp extends McApiClient {
    private _timeoutMs: number = 10000;
    private _pinger: number | undefined;
    private _hostname: string | undefined;
    private _httpRequestPromise: Promise<HttpResponse> | undefined;
    private readonly _httpWriter: NetDataWriter = new NetDataWriter();
    private readonly _httpReader: NetDataReader = new NetDataReader();
    private readonly _writer: NetDataWriter = new NetDataWriter();
    private readonly _reader: NetDataReader = new NetDataReader();

    constructor() {
        super();
        new CommandManager(this);

        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            switch (ev.id) {
                case `${VoiceCraft.Namespace}:sendPacket`:
                    if (this.ConnectionState !== McApiConnectionState.Connected) return;
                    this.OutboundQueue.enqueue(Z85.GetBytesWithPadding(ev.message));
                    break;
            }
        });
    }


    public async ConnectAsync(ip: string, _: number, loginToken: string): Promise<void> {
        if (this.ConnectionState !== McApiConnectionState.Disconnected) return;
        this.ConnectionState = McApiConnectionState.Connecting;
        this.Reset();

        this._hostname = ip;
        const requestId = Guid.Create().toString();
        const packet = new McApiLoginRequestPacket(requestId, loginToken, VoiceCraft.Version);
        try {
            this._writer.Reset();
            this._writer.PutByte(packet.PacketType);
            this._writer.PutPacket(packet);
            this.OutboundQueue.enqueue(this._writer.CopyData());
            const response = await this.GetResponseAsync<McApiAcceptResponsePacket, string>(
                McApiPacketType.AcceptResponse,
                requestId,
                response => response.Token,
                160
            )
            this.ConnectionState = McApiConnectionState.Connected;
            this._pinger = system.runInterval(() => {
                if (this.ConnectionState === McApiConnectionState.Connected) {
                    this.SendPacket(new McApiPingRequestPacket());
                }
            }, 20);
            this.Token = response;
            this.ConnectionState = McApiConnectionState.Connected;
            this.OnConnected?.Invoke(response);
        } catch (ex) {
            let error = "";
            if (ex instanceof Error) {
                error = ex.message;
            }
            await this.DisconnectAsync(error, true).then();
            throw ex;
        }
    }

    public override Update(): void {
        if (this.ConnectionState === McApiConnectionState.Disconnected) {
            return;
        }

        if (Date.now() - this.LastPing >= this._timeoutMs &&
            this.ConnectionState !== McApiConnectionState.Disconnecting &&
            this.ConnectionState !== McApiConnectionState.Connecting) {
            this.DisconnectAsync(Locales.VcMcApi.DisconnectReason.Timeout, true).then();
            return;
        }

        if(this._hostname !== undefined)
            this.SendPacketsLogic(this._hostname);

        let packet = this.InboundQueue.dequeue();
        while (packet !== undefined) {
            try {
                this._reader.Clear();
                this._reader.SetBufferSource(packet);
                this.ProcessPacket(this._reader, (mcApiPacket) => {
                    this.LastPing = Date.now();
                    if (!this.AuthorizePacket(mcApiPacket, this.Token ?? "")) return;
                    this.ExecutePacket(mcApiPacket);
                });
            } catch {
                //Do Nothing
            }
            packet = this.InboundQueue.dequeue();
        }
    }

    public async DisconnectAsync(reason?: string, force?: boolean): Promise<void> {
        if (this.ConnectionState === McApiConnectionState.Disconnected ||
            this.ConnectionState === McApiConnectionState.Disconnecting) return;

        if (force) {
            this.Reset();
            this.ConnectionState = McApiConnectionState.Disconnected;
            this.OnDisconnected.Invoke(reason ?? Locales.VcMcApi.DisconnectReason.Manual);
            return;
        }

        this.ConnectionState = McApiConnectionState.Disconnecting;
        this.SendPacket(new McApiLogoutRequestPacket(this.Token ?? ""));

        while (this.ConnectionState === McApiConnectionState.Disconnecting) {
            await system.waitTicks(1);
        }

        this.Reset();
        this.OnDisconnected.Invoke(reason ?? Locales.VcMcApi.DisconnectReason.Manual);
    }

    public override SendPacket(packet: IMcApiPacket): boolean {
        if (this.ConnectionState === McApiConnectionState.Disconnected ||
            this.ConnectionState === McApiConnectionState.Disconnecting) return false;
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        this._writer.PutPacket(packet);
        this.OutboundQueue.enqueue(this._writer.CopyData());
        return true;
    }

    private Reset(): void {
        this.Token = undefined;
        this.LastPing = 0;
        this.OutboundQueue.clear();
        this.InboundQueue.clear();
        this._hostname = undefined;
        if (this._pinger !== undefined)
            system.clearRun(this._pinger);
        if(this._httpRequestPromise !== undefined)
            http.cancelAll("Reset Called");
    }

    private async GetResponseAsync<TPacket extends IMcApiPacket & IMcApiRIdPacket, TResult>(
        packetType: McApiPacketType,
        requestId: string,
        selector: (packet: TPacket) => TResult,
        timeoutTicks: number,
        token?: AbortSignal
    ): Promise<TResult> {
        const tcs = Promise.withResolvers<TResult>();
        const dTcs = Promise.withResolvers<string | undefined>();
        const timeoutId = system.runTimeout(() => {
            tcs.reject(new Error("TimeoutException"));
        }, timeoutTicks);
        if (token !== undefined)
            token.onabort = (_) => tcs.reject(new Error("OperationCanceledException"));

        this.OnPacketReceived.Subscribe(EventCallback);
        this.OnDisconnected.Subscribe(OnDisconnectedCallback);

        try {
            let result: TResult | undefined;
            let disconnectResult: string | undefined;
            await Promise.race([
                tcs.promise.then(x => {
                    result = x;
                }),
                dTcs.promise.then(x => {
                    disconnectResult = x;
                })
            ]);
            if (result !== undefined)
                return result;
            throw new Error(disconnectResult ?? "Disconnected");

        } finally {
            system.clearRun(timeoutId);
            if (token !== undefined)
                token.onabort = null;
            this.OnPacketReceived.Unsubscribe(EventCallback);
            this.OnDisconnected.Unsubscribe(OnDisconnectedCallback);
        }

        function EventCallback(packet: IMcApiPacket) {
            if (packet.PacketType === packetType && "RequestId" in packet && packet.RequestId === requestId)
                try {
                    tcs.resolve(selector(packet as TPacket));
                } catch (err) {
                    tcs.reject(err);
                }
        }

        function OnDisconnectedCallback(reason: string | undefined) {
            dTcs.resolve(reason);
        }
    }

    private SendPacketsLogic(hostname: string): void {
        if(this._httpRequestPromise !== undefined) return;

        let packetData = this.OutboundQueue.dequeue();
        this._httpWriter.Reset();

        while (packetData !== undefined) {
            this._httpWriter.PutUshort(packetData.length);
            this._httpWriter.PutBytes(packetData, 0, packetData.length);
            packetData = this.OutboundQueue.dequeue();
        }

        const request = new HttpRequest(hostname);
        request.setBody(Z85.GetStringWithPadding(this._httpWriter.CopyData()));
        //@ts-ignore
        request.setMethod(HttpRequestMethod.Post);
        request.setHeaders([
            new HttpHeader('Content-Type', 'text/plain; charset=utf-8'),
            new HttpHeader('Authorization', `Bearer ${this.Token}`)
        ]);
        request.setTimeout(8000); //8 Second timeout. Less than the normal HTTP timeout.
        this._httpRequestPromise = http.request(request);
        this._httpRequestPromise.then((res: HttpResponse) => {
            if(res.status !== 200) {
                this.DisconnectAsync(`HTTP Error: ${res.status}`, true).then();
                return;
            }
            this._httpRequestPromise = undefined;
            this.ReceivePacketsLogic(res);
        }).catch((ex) => {
            this.DisconnectAsync(`HTTP Error: ${ex}`, true).then();
            this._httpRequestPromise = undefined;
        });
    }

    private ReceivePacketsLogic(response: HttpResponse): void {
        if (response.body.length <= 0) return;
        const packedPackets = Z85.GetBytesWithPadding(response.body);
        this._httpReader.Clear();
        this._httpReader.SetBufferSource(packedPackets);

        while (!this._httpReader.EndOfData) {
            const size = this._httpReader.GetUshort();
            try {
                if (size <= 0) continue;
                const data = new Uint8Array(size);
                this._httpReader.GetBytes(data, size);
                this.InboundQueue.enqueue(data);
            } catch {
                //Do Nothing
            }
        }
    }
}
