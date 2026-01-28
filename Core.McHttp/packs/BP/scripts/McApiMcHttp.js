import "./Extensions";
import { McApiClient } from "./API/McApiClient";
import { McApiConnectionState } from "./API/Data/Enums";
import { McApiLoginRequestPacket } from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import { Guid } from "./API/Data/Guid";
import { NetDataWriter } from "./API/Data/NetDataWriter";
import { system } from "@minecraft/server";
import { McHttpUpdatePacket } from "./API/Network/McHttpPackets/McHttpUpdatePacket";
import { http, HttpHeader, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";
import { Z85 } from "./API/Encoders/Z85";
import { Queue } from "./API/Data/Queue";
import { McApiLogoutRequestPacket } from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import { NetDataReader } from "./API/Data/NetDataReader";
import { CommandManager } from "./Managers/CommandManager";
import { McApiPingRequestPacket } from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
import { VoiceCraft } from "./API/VoiceCraft";
import { Locales } from "./API/Locales";
export class McApiMcHttp extends McApiClient {
    _cm = new CommandManager(this);
    _timeoutMs = 10000;
    _lastPingPacket = 0;
    _awaitingRequest = false;
    _updater;
    _outboundQueue = new Queue();
    _writer = new NetDataWriter();
    _reader = new NetDataReader();
    constructor() {
        super();
        system.afterEvents.scriptEventReceive.subscribe((ev) => {
            if (this.ConnectionState != McApiConnectionState.Connected)
                return;
            this._outboundQueue.enqueue(ev.message);
        });
    }
    async ConnectAsync(ip, _, loginToken) {
        if (this.ConnectionState != McApiConnectionState.Disconnected)
            return;
        this.ConnectionState = McApiConnectionState.Connecting;
        this.Token = undefined;
        this.LastPing = 0;
        this._lastPingPacket = 0;
        this._outboundQueue.clear();
        this.StopUpdater();
        this.StartUpdater(ip);
        const requestId = Guid.Create().toString();
        const packet = new McApiLoginRequestPacket(requestId, loginToken, this.Version);
        try {
            this.SendPacket(packet);
            const startTime = Date.now();
            while (this.ConnectionState == McApiConnectionState.Connecting) {
                await system.waitTicks(1);
                if (Date.now() - startTime >= this._timeoutMs) {
                    await this.DisconnectAsync(Locales.VcMcApi.DisconnectReason.Timeout, true);
                    return;
                }
            }
        }
        catch (ex) {
            await this.DisconnectAsync(`${ex}`, true);
        }
    }
    async DisconnectAsync(reason, force = false) {
        if (this.ConnectionState == McApiConnectionState.Disconnected ||
            this.ConnectionState == McApiConnectionState.Disconnecting)
            return;
        if (force) {
            this.ConnectionState = McApiConnectionState.Disconnected;
            this.OnDisconnected.Invoke(reason);
            system.sendScriptEvent(`${VoiceCraft.Namespace}:onDisconnected`, reason ?? Locales.VcMcApi.DisconnectReason.Manual);
            return;
        }
        this.SendPacket(new McApiLogoutRequestPacket(this.Token ?? ""));
        this.ConnectionState = McApiConnectionState.Disconnecting;
        while (this.ConnectionState == McApiConnectionState.Disconnecting) {
            await system.waitTicks(1);
        }
        this.ConnectionState = McApiConnectionState.Disconnected;
        this.OnDisconnected.Invoke(reason);
        system.sendScriptEvent(`${VoiceCraft.Namespace}:onDisconnected`, reason ?? Locales.VcMcApi.DisconnectReason.Manual);
    }
    SendPacket(packet) {
        if (this.ConnectionState == McApiConnectionState.Disconnected ||
            this.ConnectionState == McApiConnectionState.Disconnecting)
            return false;
        this._writer.Reset();
        this._writer.PutByte(packet.PacketType);
        this._writer.PutPacket(packet);
        this._outboundQueue.enqueue(Z85.GetStringWithPadding(this._writer.CopyData()));
        return true;
    }
    StartUpdater(hostname) {
        this._updater = system.runInterval(async () => await this.HttpUpdaterLogic(hostname));
    }
    StopUpdater() {
        if (this._updater == undefined)
            return;
        system.clearRun(this._updater);
    }
    async HttpUpdaterLogic(hostname) {
        try {
            if (this._awaitingRequest)
                return;
            if (this.ConnectionState == McApiConnectionState.Disconnected) {
                this.StopUpdater();
                return;
            }
            if (Date.now() - this.LastPing >= this._timeoutMs &&
                this.ConnectionState != McApiConnectionState.Disconnecting &&
                this.ConnectionState != McApiConnectionState.Connecting) {
                this.DisconnectAsync(Locales.VcMcApi.DisconnectReason.Timeout, true).then();
                this.StopUpdater();
                return;
            }
            if (Date.now() - this._lastPingPacket >= this._timeoutMs / 8 &&
                this.ConnectionState == McApiConnectionState.Connected) {
                this.SendPacket(new McApiPingRequestPacket());
                this._lastPingPacket = Date.now();
            }
            this._awaitingRequest = true;
            const response = await http.request(this.SendPacketsLogic(hostname));
            this._awaitingRequest = false;
            if (response.status !== 200)
                return;
            this.ReceivePacketsLogic(response);
        }
        catch (ex) {
            console.error(ex);
            //Do Nothing.
        }
        finally {
            this._awaitingRequest = false;
        }
    }
    SendPacketsLogic(hostname) {
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
            new HttpHeader('Authorization', `Bearer ${this.Token}`)
        ]);
        request.setTimeout(8000); //8 Second timeout. Less than the normal HTTP timeout.
        return request;
    }
    ReceivePacketsLogic(response) {
        const responsePacket = Object.assign(new McHttpUpdatePacket(), JSON.parse(response.body));
        for (const packetString of responsePacket.Packets) {
            const source = Z85.GetBytesWithPadding(packetString);
            this._reader.SetBufferSource(source);
            this.ProcessPacket(this._reader, (packet) => {
                this.LastPing = Date.now();
                system.sendScriptEvent(`${VoiceCraft.Namespace}:onPacket`, packetString);
                this.ExecutePacket(packet);
            });
        }
    }
}
