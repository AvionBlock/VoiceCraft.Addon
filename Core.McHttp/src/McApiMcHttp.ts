import "./Extensions";
import {McApiClient} from "./API/McApiClient";
import {McApiConnectionState, McApiPacketType} from "./API/Data/Enums";
import {McApiLoginRequestPacket} from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import {Guid} from "./API/Data/Guid";
import {NetDataWriter} from "./API/Data/NetDataWriter";
import {McApiAcceptResponsePacket} from "./API/Network/McApiPackets/Response/McApiAcceptResponsePacket";
import {IMcApiPacket} from "./API/Network/McApiPackets/IMcApiPacket";
import {IsIMcApiRIdPacket} from "./API/Network/McApiPackets/IMcApiRIdPacket";
import {system} from "@minecraft/server";
import {Event} from "./API/Event";
import {McHttpUpdatePacket} from "./API/Network/McHttpPackets/McHttpUpdatePacket";
import {http, HttpHeader, HttpRequest, HttpResponse} from "@minecraft/server-net";
import {Z85} from "./API/Encoders/Z85";
import {Queue} from "./API/Data/Queue";
import {McApiLogoutRequestPacket} from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import {NetDataReader} from "./API/Data/NetDataReader";

export class McApiMcHttp extends McApiClient {
    private _timeoutMs: number = 10000;
    private readonly _writer: NetDataWriter = new NetDataWriter();
    private readonly _reader: NetDataReader = new NetDataReader();
    private _awaitingRequest: boolean = false;
    private _sessionToken: string = "";
    private _updater: number | undefined;
    private _outboundQueue: Queue<string> = new Queue<string>();

    public override OnConnected: Event<string> = new Event<string>();
    public override OnDisconnected: Event<string | undefined> = new Event<string | undefined>();

    public async ConnectAsync(ip: string, _: number, loginToken: string): Promise<void> {
        if (this.ConnectionState != McApiConnectionState.Disconnected) return;
        this.ConnectionState = McApiConnectionState.Connecting;
        this._sessionToken = "";
        this._outboundQueue.clear();
        this.StopUpdater();
        this.StartUpdater(ip);

        const requestId = Guid.Create().toString();
        const packet = new McApiLoginRequestPacket(requestId, loginToken, this.Version);
        try {
            this.SendPacket(packet);
            const result = await this.GetRidResponseAsync<McApiAcceptResponsePacket>(
                requestId,
                McApiPacketType.AcceptResponse,
                8000);
            this.ConnectionState = McApiConnectionState.Connected;
            this._sessionToken = result.Token;
            this.OnConnected.Invoke(result.Token);
        } catch (ex) {
            await this.DisconnectAsync(`${ex}`, true);
        }
    }

    public async DisconnectAsync(reason?: string, force: boolean = false): Promise<void> {
        if (this.ConnectionState == McApiConnectionState.Disconnected ||
            this.ConnectionState == McApiConnectionState.Disconnecting) return;
        if (force) {
            this.ConnectionState = McApiConnectionState.Disconnected;
            this.OnDisconnected.Invoke(reason);
            return;
        }

        this.SendPacket(new McApiLogoutRequestPacket(this._sessionToken));
        this.ConnectionState = McApiConnectionState.Disconnecting;

        while (this.ConnectionState == McApiConnectionState.Disconnecting) {
            await system.waitTicks(1);
        }
        this.ConnectionState = McApiConnectionState.Disconnected;
        this.OnDisconnected.Invoke(reason);
    }

    public override SendPacket(packet: IMcApiPacket): boolean {
        if (this.ConnectionState == McApiConnectionState.Disconnected ||
            this.ConnectionState == McApiConnectionState.Disconnecting) return false;
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        this._writer.PutPacket(packet);
        this._outboundQueue.enqueue(Z85.GetStringWithPadding(this._writer.CopyData()))
        return true;
    }

    private StartUpdater(hostname: string): void {
        this._updater = system.runInterval(async () => this.HttpUpdaterLogic(hostname));
    }

    private StopUpdater(): void {
        if (this._updater == undefined) return;
        system.clearRun(this._updater);
    }

    private async HttpUpdaterLogic(hostname: string) {
        try {
            if (this._awaitingRequest)
                return;
            if (this.ConnectionState == McApiConnectionState.Disconnected) {
                this.StopUpdater();
                return;
            }
            if (Date.now() - this.LastPing >= this._timeoutMs &&
                this.ConnectionState != McApiConnectionState.Disconnecting) {
                this.DisconnectAsync("Timeout", true).then();
                this.StopUpdater();
                return;
            }

            this._awaitingRequest = true;
            const response = await http.request(this.SendPacketsLogic(hostname));
            this._awaitingRequest = false;
            if (response.status !== 200) return;
            this.ReceivePacketsLogic(response);
        } catch {
            //Do Nothing.
        } finally {
            this._awaitingRequest = false;
        }
    }

    private SendPacketsLogic(hostname: string): HttpRequest {
        const requestPacket = new McHttpUpdatePacket();
        let packet = this._outboundQueue.dequeue();
        while (packet !== undefined) {
            requestPacket.Packets.push(packet);
            packet = this._outboundQueue.dequeue();
        }
        const request = new HttpRequest(hostname);
        request.setBody(JSON.stringify(requestPacket));
        //@ts-ignore
        request.setMethod(HttpRequestMethod.Post);
        request.setHeaders([
            new HttpHeader('Content-Type', 'application/json'),
            new HttpHeader('Authorization', `Bearer ${this._sessionToken}`)
        ]);
        request.setTimeout(8000); //8 Second timeout. Less than the normal HTTP timeout.
        return request;
    }

    private ReceivePacketsLogic(response: HttpResponse): void {
        const responsePacket = Object.assign(new McHttpUpdatePacket(), JSON.parse(response.body));
        for (const packet of responsePacket.Packets) {
            const source = Z85.GetBytesWithPadding(packet);
            this._reader.SetBufferSource(source);
            this.ProcessPacket(this._reader, (packet) => this.ExecutePacket(packet));
        }
    }

    private async GetResponseAsync<T>(packetType: McApiPacketType, timeout: number): Promise<T> {
        const startTime = Date.now();
        let result: IMcApiPacket | undefined = undefined;
        let disconnectReason: string | undefined = undefined;
        const onReceived = this.OnPacketReceived.Subscribe((packet) => OnPacketReceived(packet));
        const onDisconnected = this.OnDisconnected.Subscribe((packet) => OnDisconnected(packet));

        try {
            while (result != undefined) {
                if (Date.now() - startTime >= timeout) {
                    throw new Error("Timeout");
                }
                if (disconnectReason != undefined) {
                    throw new Error(disconnectReason);
                }
                await system.waitTicks(1);
            }

            //TS forces me to do this.
            if (result != undefined) {
                return result as T;
            }
            throw new Error("Failure to get result!");
        } finally {
            this.OnPacketReceived.Unsubscribe(onReceived);
            this.OnDisconnected.Unsubscribe(onDisconnected);
        }

        function OnPacketReceived(packet: IMcApiPacket): void {
            if (packet.PacketType != packetType) return;
            result = packet;
        }

        function OnDisconnected(reason: string | undefined): void {
            disconnectReason = reason;
        }
    }

    private async GetRidResponseAsync<T>(requestId: string, packetType: McApiPacketType, timeout: number): Promise<T> {
        const startTime = Date.now();
        let result: IMcApiPacket | undefined = undefined;
        let disconnectReason: string | undefined = undefined;

        const onReceived = this.OnPacketReceived.Subscribe((packet) => OnPacketReceived(packet));
        const onDisconnected = this.OnDisconnected.Subscribe((packet) => OnDisconnected(packet));
        try {
            while (result != undefined) {
                if (Date.now() - startTime >= timeout) {
                    throw new Error("Timeout");
                }
                if (disconnectReason != undefined) {
                    throw new Error(disconnectReason);
                }
                await system.waitTicks(1);
            }

            //TS forces me to do this.
            if (result != undefined) {
                return result as T;
            }
            throw new Error("Failure to get result!");
        } finally {
            this.OnPacketReceived.Unsubscribe(onReceived);
            this.OnDisconnected.Unsubscribe(onDisconnected);
        }

        function OnPacketReceived(packet: IMcApiPacket): void {
            if (!IsIMcApiRIdPacket(packet) || packet.RequestId != requestId || packet.PacketType != packetType) return;
            result = packet;
        }

        function OnDisconnected(reason: string | undefined): void {
            disconnectReason = reason;
        }
    }
}
