import "./Extensions";
import { CommandManager } from "./Managers/CommandManager";
import { NetDataWriter } from "./API/Data/NetDataWriter";
import { NetDataReader } from "./API/Data/NetDataReader";
import { McApiClient } from "./API/McApiClient";
import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system } from "@minecraft/server";
import { EventType, McApiConnectionState, McApiPacketType } from "./API/Data/Enums";
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
        system.beforeEvents.startup.subscribe((ev) => {
            const registry = ev.customCommandRegistry;
            registry.registerCommand({
                name: `${VoiceCraft.Namespace}:data_tunnel`,
                description: "Data transfer tunnel between servers",
                permissionLevel: CommandPermissionLevel.Host,
                optionalParameters: [
                    { name: "max_byte_length", type: CustomCommandParamType.Integer },
                    { name: "data", type: CustomCommandParamType.String },
                ],
            }, (origin, maxByteLength, data) => this.HandleDataTunnelCommand(origin, maxByteLength, data));
        });
    }
    async ConnectAsync(_, __, loginToken) {
        if (this.ConnectionState !== McApiConnectionState.Disconnected)
            return;
        this.ConnectionState = McApiConnectionState.Connecting;
        this.Reset();
        const requestId = Guid.Create().toString();
        const packet = new McApiLoginRequestPacket(requestId, loginToken, VoiceCraft.Version, [...this._subscribedEvents]);
        try {
            this._writer.Reset();
            this._writer.PutByte(packet.PacketType);
            this._writer.PutPacket(packet);
            this.OutboundQueue.enqueue(this._writer.CopyData());
            await this.GetResponseAsync(McApiPacketType.AcceptResponse, requestId, response => response.Token, 160);
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
            return;
        }
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
            catch (ex) {
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
        if (this._pinger !== undefined)
            system.clearRun(this._pinger);
    }
    HandleDataTunnelCommand(_, maxByteLength, data) {
        this.ReceivePacketsLogic(data);
        return { status: CustomCommandStatus.Success, message: this.SendPacketsLogic(maxByteLength) };
    }
    SendPacketsLogic(maxByteLength) {
        let packetData = this.OutboundQueue.dequeue();
        this._mcWssWriter.Reset();
        while (this._mcWssWriter.Length < maxByteLength && packetData !== undefined) {
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
