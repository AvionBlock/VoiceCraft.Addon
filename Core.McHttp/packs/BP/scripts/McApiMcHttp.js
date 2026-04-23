import "./Extensions";
import { McApiClient } from "./API/McApiClient";
import { McApiConnectionState, McApiPacketType } from "./API/Data/Enums";
import { McApiLoginRequestPacket } from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import { Guid } from "./API/Data/Guid";
import { NetDataWriter } from "./API/Data/NetDataWriter";
import { system } from "@minecraft/server";
import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";
import { Z85 } from "./API/Encoders/Z85";
import { McApiLogoutRequestPacket } from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import { NetDataReader } from "./API/Data/NetDataReader";
import { CommandManager } from "./Managers/CommandManager";
import { McApiPingRequestPacket } from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
import { VoiceCraft } from "./API/VoiceCraft";
import { Locales } from "./API/Locales";
export class McApiMcHttp extends McApiClient {
    _timeoutMs = 10000;
    _pinger;
    _hostname;
    _httpRequestPromise;
    _httpWriter = new NetDataWriter();
    _httpReader = new NetDataReader();
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    constructor() {
        super();
        new CommandManager(this);
        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            switch (ev.id) {
                case `${VoiceCraft.Namespace}:sendPacket`:
                    if (this.ConnectionState !== McApiConnectionState.Connected)
                        return;
                    this.OutboundQueue.enqueue(Z85.GetBytesWithPadding(ev.message));
                    break;
            }
        });
    }
    async ConnectAsync(ip, _, loginToken) {
        if (this.ConnectionState !== McApiConnectionState.Disconnected)
            return;
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
            const response = await this.GetResponseAsync(McApiPacketType.AcceptResponse, requestId, response => response.Token, 160);
            this.ConnectionState = McApiConnectionState.Connected;
            this._pinger = system.runInterval(() => {
                if (this.ConnectionState === McApiConnectionState.Connected) {
                    this.SendPacket(new McApiPingRequestPacket());
                }
            }, 20);
            this.Token = response;
            this.ConnectionState = McApiConnectionState.Connected;
            this.OnConnected?.Invoke(response);
        }
        catch (ex) {
            let error = "";
            if (ex instanceof Error) {
                error = ex.message;
            }
            await this.DisconnectAsync(error, true).then();
            throw ex;
        }
    }
    Update() {
        if (this.ConnectionState === McApiConnectionState.Disconnected) {
            return;
        }
        if (Date.now() - this.LastPing >= this._timeoutMs &&
            this.ConnectionState !== McApiConnectionState.Disconnecting &&
            this.ConnectionState !== McApiConnectionState.Connecting) {
            this.DisconnectAsync(Locales.VcMcApi.DisconnectReason.Timeout, true).then();
            console.log("Disconnected!");
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
                    if (!this.AuthorizePacket(mcApiPacket, this.Token ?? ""))
                        return;
                    this.ExecutePacket(mcApiPacket);
                });
            }
            catch {
                //Do Nothing
            }
            packet = this.InboundQueue.dequeue();
        }
    }
    async DisconnectAsync(reason, force) {
        if (this.ConnectionState === McApiConnectionState.Disconnected ||
            this.ConnectionState === McApiConnectionState.Disconnecting)
            return;
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
    SendPacket(packet) {
        if (this.ConnectionState === McApiConnectionState.Disconnected ||
            this.ConnectionState === McApiConnectionState.Disconnecting)
            return false;
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        this._writer.PutPacket(packet);
        this.OutboundQueue.enqueue(this._writer.CopyData());
        return true;
    }
    Reset() {
        this.Token = undefined;
        this.LastPing = 0;
        this.OutboundQueue.clear();
        this.InboundQueue.clear();
        this._hostname = undefined;
        if (this._pinger !== undefined)
            system.clearRun(this._pinger);
        if (this._httpRequestPromise !== undefined)
            http.cancelAll("Reset Called");
    }
    async GetResponseAsync(packetType, requestId, selector, timeoutTicks, token) {
        const tcs = Promise.withResolvers();
        const dTcs = Promise.withResolvers();
        const timeoutId = system.runTimeout(() => {
            tcs.reject(new Error("TimeoutException"));
        }, timeoutTicks);
        if (token !== undefined)
            token.onabort = (_) => tcs.reject(new Error("OperationCanceledException"));
        this.OnPacketReceived.Subscribe(EventCallback);
        this.OnDisconnected.Subscribe(OnDisconnectedCallback);
        try {
            let result;
            let disconnectResult;
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
        }
        finally {
            system.clearRun(timeoutId);
            if (token !== undefined)
                token.onabort = null;
            this.OnPacketReceived.Unsubscribe(EventCallback);
            this.OnDisconnected.Unsubscribe(OnDisconnectedCallback);
        }
        function EventCallback(packet) {
            if (packet.PacketType === packetType && "RequestId" in packet && packet.RequestId === requestId)
                try {
                    tcs.resolve(selector(packet));
                }
                catch (err) {
                    tcs.reject(err);
                }
        }
        function OnDisconnectedCallback(reason) {
            dTcs.resolve(reason);
        }
    }
    SendPacketsLogic(hostname) {
        if (this._httpRequestPromise !== undefined)
            return;
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
        this._httpRequestPromise.then((res) => {
            if (res.status !== 200) {
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
    ReceivePacketsLogic(response) {
        if (response.body.length <= 0)
            return;
        const packedPackets = Z85.GetBytesWithPadding(response.body);
        this._httpReader.Clear();
        this._httpReader.SetBufferSource(packedPackets);
        while (!this._httpReader.EndOfData) {
            const size = this._httpReader.GetUshort();
            try {
                if (size <= 0)
                    continue;
                const data = new Uint8Array(size);
                this._httpReader.GetBytes(data, size);
                this.InboundQueue.enqueue(data);
            }
            catch {
                //Do Nothing
            }
        }
    }
}
