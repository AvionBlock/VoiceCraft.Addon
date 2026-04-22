import "./Extensions";
import { CommandManager } from "./Managers/CommandManager";
import { NetDataWriter } from "./API/Data/NetDataWriter";
import { NetDataReader } from "./API/Data/NetDataReader";
import { McApiClient } from "./API/McApiClient";
import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system } from "@minecraft/server";
import { McApiConnectionState } from "./API/Data/Enums";
import { Guid } from "./API/Data/Guid";
import { McApiLoginRequestPacket } from "./API/Network/McApiPackets/Request/McApiLoginRequestPacket";
import { VoiceCraft } from "./API/VoiceCraft";
import { Locales } from "./API/Locales";
import { McApiLogoutRequestPacket } from "./API/Network/McApiPackets/Request/McApiLogoutRequestPacket";
import { Z85 } from "./API/Encoders/Z85";
import { McApiPingRequestPacket } from "./API/Network/McApiPackets/Request/McApiPingRequestPacket";
export class McApiMcWss extends McApiClient {
    _timeoutMs = 10000;
    _pinger;
    _mcWssWriter = new NetDataWriter();
    _mcWssReader = new NetDataReader();
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
        system.beforeEvents.startup.subscribe((ev) => {
            const registry = ev.customCommandRegistry;
            registry.registerCommand({
                name: `${VoiceCraft.Namespace}:data_tunnel`,
                description: "Data transfer tunnel between servers",
                permissionLevel: CommandPermissionLevel.Host,
                optionalParameters: [
                    { name: "max_string_length", type: CustomCommandParamType.Integer },
                    { name: "data", type: CustomCommandParamType.String },
                ],
            }, (origin, maxStringLength, data) => this.HandleDataTunnelCommand(origin, maxStringLength, data));
        });
    }
    async ConnectAsync(_, __, loginToken) {
        if (this.ConnectionState !== McApiConnectionState.Disconnected)
            return;
        this.ConnectionState = McApiConnectionState.Connecting;
        this.Reset();
        const requestId = Guid.Create().toString();
        const packet = new McApiLoginRequestPacket(requestId, loginToken, VoiceCraft.Version);
        try {
            this._writer.Reset();
            this._writer.PutByte(packet.PacketType);
            this._writer.PutPacket(packet);
            this.OutboundQueue.enqueue(this._writer.CopyData());
            const response = await this.GetResponseAsync(requestId, response => response.Token, 160);
            this.ConnectionState = McApiConnectionState.Connected;
            this._pinger = system.runInterval(() => {
                if (this.ConnectionState === McApiConnectionState.Connected) {
                    this.SendPacket(new McApiPingRequestPacket());
                }
            }, 20);
            this.Token = packet.Token;
            this.ConnectionState = McApiConnectionState.Connected;
            this.OnConnected?.Invoke(response);
        }
        catch (ex) {
            let error = "";
            if (ex instanceof Error) {
                error = ex.message;
            }
            await this.DisconnectAsync(error).then();
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
            this.DisconnectAsync(Locales.VcMcApi.DisconnectReason.Timeout).then();
            return;
        }
        let packet = this.InboundQueue.dequeue();
        while (packet !== undefined) {
            try {
                this.Token;
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
    async DisconnectAsync(reason) {
        if (this.ConnectionState === McApiConnectionState.Disconnected ||
            this.ConnectionState === McApiConnectionState.Disconnecting)
            return;
        if (this.ConnectionState !== McApiConnectionState.Connecting) {
            this.ConnectionState = McApiConnectionState.Disconnecting;
            this.SendPacket(new McApiLogoutRequestPacket(this.Token ?? ""));
            while (this.ConnectionState === McApiConnectionState.Disconnecting) {
                await system.waitTicks(1);
            }
        }
        this.Reset();
        this.ConnectionState = McApiConnectionState.Disconnected;
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
        if (this._pinger !== undefined)
            system.clearRun(this._pinger);
    }
    async GetResponseAsync(requestId, selector, timeoutTicks, token) {
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
            if ("RequestId" in packet && packet.RequestId === requestId)
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
    HandleDataTunnelCommand(_, maxStringLength, data) {
        system.run(() => {
            this.ReceivePacketsLogic(data);
        });
        return { status: CustomCommandStatus.Success, message: this.SendPacketsLogic(maxStringLength) };
    }
    SendPacketsLogic(maxStringLength) {
        let packetData = this.OutboundQueue.dequeue();
        this._mcWssWriter.Reset();
        while (this._mcWssWriter.Length < maxStringLength && packetData !== undefined) {
            this._mcWssWriter.PutUshort(packetData.length);
            this._mcWssWriter.PutBytes(packetData, 0, packetData.length);
            packetData = this.OutboundQueue.dequeue();
        }
        return Z85.GetStringWithPadding(this._mcWssWriter.CopyData()).replaceAll("%", "%%");
    }
    ReceivePacketsLogic(data) {
        if (data.length <= 0)
            return;
        const packedPackets = Z85.GetBytesWithPadding(data);
        this._mcWssReader.Clear();
        this._mcWssReader.SetBufferSource(packedPackets);
        while (!this._mcWssReader.EndOfData) {
            const size = this._mcWssReader.GetUshort();
            try {
                if (size <= 0)
                    continue;
                const data = new Uint8Array(size);
                this._mcWssReader.GetBytes(data, size);
                this.InboundQueue.enqueue(data);
            }
            catch {
                //Do Nothing
            }
        }
    }
}
