import {VoiceCraft} from "./VoiceCraft";
import {McApiConnectionState, McApiPacketType} from "./Data/Enums";
import {IMcApiPacket} from "./Network/McApiPackets/IMcApiPacket";
import {Event} from "./Event";
import {NetDataReader} from "./Data/NetDataReader";
import {McApiAcceptResponsePacket} from "./Network/McApiPackets/Response/McApiAcceptResponsePacket";
import {McApiDenyResponsePacket} from "./Network/McApiPackets/Response/McApiDenyResponsePacket";
import {Queue} from "./Data/Queue";
import {system} from "@minecraft/server";
import {IMcApiRIdPacket} from "./Network/McApiPackets/IMcApiRIdPacket";

export abstract class McApiClient {
    private _voicecraft: VoiceCraft = new VoiceCraft(true);
    private _connectionState: McApiConnectionState = McApiConnectionState.Disconnected;
    private _token: string | undefined;
    private _lastPing: number = 0;
    public OutboundQueue: Queue<Uint8Array> = new Queue<Uint8Array>();
    public InboundQueue: Queue<Uint8Array> = new Queue<Uint8Array>();

    protected constructor() {
        this._voicecraft.OnPacket.Subscribe((data) => this.OnPacketReceived.Invoke(data));
    }

    public get Token(): string | undefined {
        return this._token;
    }

    protected set Token(value: string | undefined) {
        this._token = value;
    }

    protected get LastPing(): number {
        return this._lastPing;
    }

    protected set LastPing(value: number) {
        this._lastPing = value;
    }

    //Events
    public OnConnected: Event<string> = new Event<string>();
    public OnDisconnected: Event<string> = new Event<string>();
    public OnPacketReceived: Event<IMcApiPacket> = new Event<IMcApiPacket>();

    public get ConnectionState() {
        return this._connectionState;
    }

    protected set ConnectionState(value: McApiConnectionState) {
        this._connectionState = value;
    }

    public abstract ConnectAsync(ip: string, port: number, loginToken: string): Promise<void>;

    public abstract Update(): void;

    public abstract DisconnectAsync(reason: string | undefined, force: boolean): Promise<void>;

    public abstract SendPacket(packet: IMcApiPacket): boolean;

    protected async GetResponseAsync<TPacket extends IMcApiPacket & IMcApiRIdPacket, TResult>(
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

    protected AuthorizePacket(packet: IMcApiPacket, token: string): boolean {
        switch (packet.constructor) {
            case McApiAcceptResponsePacket:
            case McApiDenyResponsePacket:
                return true;
            default:
                return this.ConnectionState === McApiConnectionState.Connected && token === this.Token;
        }
    }

    protected ProcessPacket(reader: NetDataReader, onParsed: (packet: IMcApiPacket) => void) {
        this._voicecraft.HandlePacket(reader, onParsed);
    }

    protected ExecutePacket(packet: IMcApiPacket): void {
        switch (packet.constructor) {
            case McApiAcceptResponsePacket:
                this.HandleAcceptResponsePacket(packet as McApiAcceptResponsePacket);
                break;
            case McApiDenyResponsePacket:
                this.HandleDenyResponsePacket(packet as McApiDenyResponsePacket);
                break;
        }
    }

    private HandleAcceptResponsePacket(packet: McApiAcceptResponsePacket): void {
        this.Token = packet.Token;
        this._connectionState = McApiConnectionState.Connected;
        this.OnConnected.Invoke(packet.Token);
    }

    private HandleDenyResponsePacket(packet: McApiDenyResponsePacket): void {
        if (this.ConnectionState !== McApiConnectionState.Connecting) return;
        this.DisconnectAsync(packet.Reason, true).then();
    }
}