import "./Extensions";
import { McApiClient } from "./API/McApiClient";
import { EventType, McApiConnectionState, McApiPacketType } from "./API/Data/Enums";
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
    _hostname;
    _httpRequestPromise;
    _httpWriter = new NetDataWriter();
    _httpReader = new NetDataReader();
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    _subscribedEvents = new Set();
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
                    if (this.ConnectionState !== McApiConnectionState.Connected)
                        return;
                    this.OutboundQueue.enqueue(Z85.GetBytesWithPadding(ev.message));
                    break;
                case `${VoiceCraft.Namespace}:eventSubscribe`:
                    const eventTypeSubscribe = EventType[ev.message];
                    if (eventTypeSubscribe === undefined)
                        return;
                    this._subscribedEvents.add(eventTypeSubscribe);
                    break;
                case `${VoiceCraft.Namespace}:eventUnsubscribe`:
                    const eventTypeUnsubscribe = EventType[ev.message];
                    if (eventTypeUnsubscribe === undefined)
                        return;
                    this._subscribedEvents.delete(eventTypeUnsubscribe);
                    break;
            }
        });
    }
    async ConnectAsync(ip, _, loginToken) {
        if (this.ConnectionState !== McApiConnectionState.Disconnected)
            return;
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
            const responsePromise = this.GetResponseAsync(McApiPacketType.AcceptResponse, requestId, response => response.Token, 160);
            this.SendPacketsLogic(`${hostname}/connect`);
            await responsePromise;
            this._hostname = hostname;
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
        if (Date.now() - this.LastPing >= this.TimeoutMs &&
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
        this._hostname = undefined;
        this.Token = undefined;
        this.LastPing = 0;
        this.OutboundQueue.clear();
        this.InboundQueue.clear();
        if (this._httpRequestPromise !== undefined)
            http.cancelAll("Reset Called");
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
