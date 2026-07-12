import { VoiceCraft } from "./VoiceCraft";
import { McApiConnectionState } from "./Data/Enums";
import { Event } from "./Event";
import { McApiAcceptResponsePacket } from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import { McApiDenyResponsePacket } from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import { Queue } from "./Data/Queue";
import { system } from "@minecraft/server";
export class McApiClient {
    _voicecraft = new VoiceCraft(true);
    _connectionState = McApiConnectionState.Disconnected;
    Token;
    LastPing = 0;
    TimeoutMs = 20000; //20s timeout
    OutboundQueue = new Queue();
    InboundQueue = new Queue();
    constructor() {
        this._voicecraft.OnPacket.Subscribe((data) => this.OnPacketReceived.Invoke(data));
    }
    //Events
    OnConnected = new Event();
    OnDisconnected = new Event();
    OnPacketReceived = new Event();
    get ConnectionState() {
        return this._connectionState;
    }
    set ConnectionState(value) {
        this._connectionState = value;
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
    AuthorizePacket(packet, token) {
        switch (packet.constructor) {
            case McApiAcceptResponsePacket:
            case McApiDenyResponsePacket:
                return true;
            default:
                return this.ConnectionState === McApiConnectionState.Connected && token === this.Token;
        }
    }
    ProcessPacket(reader, onParsed) {
        this._voicecraft.HandlePacket(reader, onParsed);
    }
    ExecutePacket(packet) {
        switch (packet.constructor) {
            case McApiAcceptResponsePacket:
                this.HandleAcceptResponsePacket(packet);
                break;
            case McApiDenyResponsePacket:
                this.HandleDenyResponsePacket(packet);
                break;
        }
    }
    HandleAcceptResponsePacket(packet) {
        this.Token = packet.Token;
        this._connectionState = McApiConnectionState.Connected;
        this.OnConnected.Invoke(packet.Token);
    }
    HandleDenyResponsePacket(packet) {
        if (this.ConnectionState !== McApiConnectionState.Connecting)
            return;
        this.DisconnectAsync(packet.Reason, true).then();
    }
}
