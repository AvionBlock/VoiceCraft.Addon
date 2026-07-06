import "./Extensions";
import {McApiClient} from "./API/McApiClient";
import {EventType, McApiConnectionState, McApiPacketType} from "./API/Data/Enums";
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

export class McApiMcHttp extends McApiClient {
    private _timeoutMs: number = 10000;
    private _hostname: string | undefined;
    private _httpRequestPromise: Promise<HttpResponse> | undefined;
    private readonly _httpWriter: NetDataWriter = new NetDataWriter();
    private readonly _httpReader: NetDataReader = new NetDataReader();
    private readonly _writer: NetDataWriter = new NetDataWriter();
    private readonly _reader: NetDataReader = new NetDataReader();
    private readonly _subscribedEvents: Set<EventType> = new Set();

    constructor() {
        super();
        new CommandManager(this);

        system.runInterval(() => {
            if (this.ConnectionState === McApiConnectionState.Connected) {
                this.SendPacket(new McApiPingRequestPacket());
            }
        }, 20);

        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            switch (ev.id) {
                case `${VoiceCraft.Namespace}:sendPacket`:
                    if (this.ConnectionState !== McApiConnectionState.Connected) return;
                    this.OutboundQueue.enqueue(Z85.GetBytesWithPadding(ev.message));
                    break;
                case `${VoiceCraft.Namespace}:eventSubscribe`:
                    const eventTypeSubscribe = EventType[ev.message as keyof typeof EventType];
                    if (eventTypeSubscribe === undefined) return;
                    this._subscribedEvents.add(eventTypeSubscribe);
                    break;
                case `${VoiceCraft.Namespace}:eventUnsubscribe`:
                    const eventTypeUnsubscribe = EventType[ev.message as keyof typeof EventType];
                    if (eventTypeUnsubscribe === undefined) return;
                    this._subscribedEvents.delete(eventTypeUnsubscribe);
                    break;
            }
        });
    }


    public async ConnectAsync(ip: string, _: number, loginToken: string): Promise<void> {
        if (this.ConnectionState !== McApiConnectionState.Disconnected) return;
        this.ConnectionState = McApiConnectionState.Connecting;
        this.Reset();
        const hostname = ip.replace(/\/+$/, "");

        const requestId = Guid.Create().toString();
        const packet = new McApiLoginRequestPacket(requestId, loginToken, VoiceCraft.Version, [...this._subscribedEvents]);
        try {
            this._writer.Reset();
            this._writer.PutByte(packet.PacketType);
            this._writer.PutPacket(packet);
            this.OutboundQueue.enqueue(this._writer.CopyData());
            const responsePromise = this.GetResponseAsync<McApiAcceptResponsePacket, string>(
                McApiPacketType.AcceptResponse,
                requestId,
                response => response.Token,
                160
            );
            this.SendPacketsLogic(`${hostname}/connect`);
            await responsePromise;
            this._hostname = hostname;
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

        if (this._hostname !== undefined)
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
        this._hostname = undefined;
        this.Token = undefined;
        this.LastPing = 0;
        this.OutboundQueue.clear();
        this.InboundQueue.clear();
        if (this._httpRequestPromise !== undefined)
            http.cancelAll("Reset Called");
    }

    private SendPacketsLogic(hostname: string): void {
        if (this._httpRequestPromise !== undefined) return;

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
            this._httpRequestPromise = undefined;
            if (res.status !== 200) {
                this.DisconnectAsync(`HTTP Error: ${res.status}`, true).then();
                return;
            }
            this.ReceivePacketsLogic(res);
        }).catch((ex) => {
            this._httpRequestPromise = undefined;
            this.DisconnectAsync(`HTTP Error: ${ex}`, true).then();
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
