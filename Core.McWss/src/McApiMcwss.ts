import { system } from "@minecraft/server";
import { Version } from "./API/Data/Version";
import { VoiceCraft } from "./API/VoiceCraft";
import { NetDataWriter } from "./API/Network/NetDataWriter";
import { NetDataReader } from "./API/Network/NetDataReader";
import { CommandManager } from "./Managers/CommandManager";
import { Guid } from "./API/Data/Guid";
import { McApiPacketType } from "./API/Data/Enums";
import { Event } from "./API/Event";
import { Queue } from "./API/Data/Queue";
import { McApiPacket } from "./API/Network/Packets/McApiPacket";
import { McApiPingPacket } from "./API/Network/Packets/McApiPingPacket";
import { McApiAcceptPacket } from "./API/Network/Packets/McApiAcceptPacket";
import { McApiLoginPacket } from "./API/Network/Packets/McApiLoginPacket";
import { McApiDenyPacket } from "./API/Network/Packets/McApiDenyPacket";
import { Locales } from "./API/Locales";
import { McApiLogoutPacket } from "./API/Network/Packets/McApiLogoutPacket";

export class McApiMcwss {
  private _vc: VoiceCraft = new VoiceCraft();
  private _version: Version = new Version(1, 1, 0);
  private _commands: CommandManager = new CommandManager(this);
  private _defaultTimeoutMs: number = 10000;

  //Connection state objects.
  private _token?: string = undefined;
  private _pinger?: number = undefined;
  private _writer: NetDataWriter = new NetDataWriter();
  private _reader: NetDataReader = new NetDataReader();
  private _lastPing: number = 0;
  private _connectionState: 0 | 1 | 2 | 3 = 0; //0: Disconnected, 1: Connecting, 2: Connected, 3: Disconnecting
  private _requestIds: Set<string> = new Set<string>();

  //Queue
  public OutboundQueue: Queue<Uint8Array> = new Queue<Uint8Array>();
  //Events
  public OnConnected: Event<string> = new Event<string>();
  public OnPacket: Event<McApiPacket> = new Event<McApiPacket>();
  public OnAcceptPacket: Event<McApiAcceptPacket> =
    new Event<McApiAcceptPacket>();
  public OnPingPacket: Event<McApiPingPacket> = new Event<McApiPingPacket>();

  public async ConnectAsync(token: string) {
    if (this._connectionState !== 0)
      throw new Error("Already in connecting/connected state!");

    try {
      this._connectionState = 1;
      this._requestIds.clear();
      this.OutboundQueue.clear();
      const packet = new McApiLoginPacket(
        Guid.Create().toString(),
        token,
        this._version
      );
      if (this.RegisterRequestId(packet.RequestId)) {
        this.SendPacket(packet);
        const response = await this.GetResponseAsync(packet.RequestId);
        if (response instanceof McApiAcceptPacket) {
          this._token = response.Token;
          this._lastPing = Date.now();
        } else if (response instanceof McApiDenyPacket) {
          throw new Error(response.ReasonKey);
        }

        if (this._pinger !== undefined) {
          system.clearRun(this._pinger);
          this._pinger = undefined;
        }
        this._pinger = system.runInterval(
          () => this.PingIntervalLogic(),
          Math.round(this._defaultTimeoutMs / 4 / 20)
        );

        this._connectionState = 2;
      }
    } catch (ex) {
      this._connectionState = 0;
      throw ex;
    }
  }

  public Disconnect() {
    if (this._token === undefined) return;
    this._connectionState = 3;
    if (this._pinger !== undefined) system.clearRun(this._pinger);
    this.OutboundQueue.clear();
    this.SendPacket(new McApiLogoutPacket(this._token));
    this._connectionState = 0;
    console.log("Disconnected!");
  }

  public SendPacket(packet: McApiPacket) {
    this._writer.Reset();
    this._writer.PutByte(packet.PacketType);
    packet.Serialize(this._writer); //Serialize
    this.OutboundQueue.enqueue(this._writer.CopyData());
  }

  public async ReceivePacketAsync(packet: Uint8Array) {
    this._reader.SetBufferSource(packet);
    const packetType = this._reader.GetByte() as McApiPacketType;
    await this.HandlePacketAsync(packetType, this._reader);
  }

  private RegisterRequestId(requestId: string): boolean {
    if (this._requestIds.has(requestId)) return false;
    this._requestIds.add(requestId);
    return true;
  }

  private DeregisterRequestId(requestId: string): boolean {
    return this._requestIds.delete(requestId);
  }

  private async GetResponseAsync(
    requestId: string,
    timeout: number = this._defaultTimeoutMs
  ): Promise<McApiPacket> {
    let callbackData: McApiPacket | undefined = undefined;
    const callback = this.OnPacket.Subscribe((data) => {
      if (
        "RequestId" in data &&
        typeof data.RequestId === "string" &&
        data.RequestId === requestId
      ) {
        this.DeregisterRequestId(requestId);
        callbackData = data;
      }
    });

    try {
      const expiryTime = Date.now() + timeout;
      while (expiryTime > Date.now()) {
        if (callbackData !== undefined) return callbackData;
        await system.waitTicks(1);
      }

      throw new Error(Locales.VcMcApi.DisconnectReason.Timeout);
    } finally {
      this.DeregisterRequestId(requestId);
      this.OnPacket.Unsubscribe(callback);
    }
  }

  private async GetTypeResponseAsync(
    requestId: string,
    type: typeof McApiPacket = McApiPacket,
    timeout: number = this._defaultTimeoutMs
  ): Promise<McApiPacket> {
    let callbackData: McApiPacket | undefined = undefined;
    const callback = this.OnPacket.Subscribe((data) => {
      if (
        "RequestId" in data &&
        typeof data.RequestId === "string" &&
        data.RequestId === requestId &&
        data instanceof type
      ) {
        this.DeregisterRequestId(requestId);
        callbackData = data;
      }
    });

    try {
      const expiryTime = Date.now() + timeout;
      while (expiryTime > Date.now()) {
        if (callbackData !== undefined) return callbackData;
        await system.waitTicks(1);
      }

      throw new Error(Locales.VcMcApi.DisconnectReason.Timeout);
    } finally {
      this.DeregisterRequestId(requestId);
      this.OnPacket.Unsubscribe(callback);
    }
  }

  private async PingIntervalLogic() {
    if (this._connectionState !== 2 || this._token === undefined) return; //Will have to do something here.
    if (Date.now() - this._lastPing >= this._defaultTimeoutMs)
      this.Disconnect();

    this.SendPacket(new McApiPingPacket(this._token));
  }

  private async HandlePacketAsync(
    packetType: McApiPacketType,
    reader: NetDataReader
  ) {
    switch (packetType) {
      case McApiPacketType.Accept:
        const acceptPacket = new McApiAcceptPacket();
        acceptPacket.Deserialize(reader);
        this.HandleAcceptPacket(acceptPacket);
        break;
      case McApiPacketType.Ping:
        const pingPacket = new McApiPingPacket();
        pingPacket.Deserialize(reader);
        this.HandlePingPacket(pingPacket);
        break;
    }
  }

  private HandleAcceptPacket(packet: McApiAcceptPacket) {
    this.OnPacket.Invoke(packet);
    this.OnAcceptPacket.Invoke(packet);
  }

  private HandlePingPacket(packet: McApiPingPacket) {
    this.OnPacket.Invoke(packet);
    this.OnPingPacket.Invoke(packet);

    this._lastPing = Date.now();
  }
}
