import {
  HttpRequestMethod,
  HttpHeader,
  HttpRequest,
  http,
} from "@minecraft/server-net";
import {
  PacketType,
  MCCommPacket,
  Login,
  Logout,
  Accept,
  Deny,
  Bind,
  Channel,
  GetChannels,
  ChannelOverride,
  GetChannelSettings,
  SetChannelSettings,
  GetDefaultSettings,
  SetDefaultSettings,
  GetParticipants,
  DisconnectParticipant,
  GetParticipantBitmask,
  SetParticipantBitmask,
  MuteParticipant,
  UnmuteParticipant,
  DeafenParticipant,
  UndeafenParticipant,
  ANDModParticipantBitmask,
  ORModParticipantBitmask,
  XORModParticipantBitmask,
  ChannelMove,
  Update,
  VoiceCraftPlayer,
} from "./MCCommAPI";
import { NetworkRunner } from "./NetworkRunner";
import { world, Player, system } from "@minecraft/server";

class Network {
  static Version = "1.0.0";

  constructor() {
    /** @type {String} */
    this.IPAddress = "";
    /** @type {Number} */
    this.Port = 9051;
    /** @type {String} */
    this.Key = "";
    /** @type {Boolean} */
    this.IsConnected = false;
    /** @type {NetworkRunner} */
    this.NetworkRunner = new NetworkRunner(this);

    world.afterEvents.entityDie.subscribe((ev) => {
      if (ev.deadEntity.typeId == "minecraft:player") {
        this.NetworkRunner.DeadPlayers.push(ev.deadEntity.id);
      }
    });

    world.afterEvents.playerSpawn.subscribe((ev) => {
      if (ev.initialSpawn && this.IsConnected) {
        const player = ev.player;
        const key = ev.player.getDynamicProperty("VCAutoBind");
        if (key != null) {
          player.sendMessage(`§2Autobinding Enabled. §eBinding to key: ${key}`);
          this.Bind(player, key)
            .then(() => {
              player.sendMessage("§aBinding Successful!");
            })
            .catch((res) => {
              player.sendMessage(`§c${res}`);
            });
        }
      }

      for (let i = 0; i < this.NetworkRunner.DeadPlayers.length; i++) {
        if (this.NetworkRunner.DeadPlayers[i] == ev.player.id) {
          this.NetworkRunner.DeadPlayers.splice(i, 1);
        }
      }
    });

    system.run(() => {
      if (world.getDynamicProperty("autoConnectOnStart")) {
        console.warn("Auto connection enabled, Connecting to server...");
        this.AutoConnect()
          .then(() => {
            console.warn("Successfully auto connected to VOIP server.");
          })
          .catch((res) => {
            console.error("Failed to auto connect to VOIP server.");
          });
      }
    });
  }

  /**
   * @description Connects to a VoiceCraft server specified by the IPAddress and Port.
   * @param {String} ipAddress
   * @param {Number} port
   * @param {String} key
   * @returns {Promise<void>}
   */
  async Connect(ipAddress, port, key) {
    if (port < 0 || port > 65535) throw "Invalid Port!";

    await this.Disconnect("Reconnecting to another server.");
    this.IPAddress = ipAddress;
    this.Port = port;
    this.Key = key;

    const packet = new Login();
    packet.LoginKey = key;
    packet.Version = Network.Version;

    /** @type {MCCommPacket} */
    let response = null;
    try {
      response = await this.SendPacket(packet);
    } catch (ex) {
      throw `Could not contact server. Please check if your IPAddress and Port are correct! ERROR: ${ex}`;
    }

    if (response.PacketId == PacketType.Accept) {
      /** @type {Accept} */
      const packetData = response;
      this.IsConnected = true;
      this.Token = packetData.Token;
      this.NetworkRunner.Start();
      return;
    } else {
      /** @type {Deny} */
      const packetData = response;
      throw `Login Denied. Server denied link request! Reason: ${packetData.Reason}`;
    }
  }

  /**
   * @description Connects to the VoiceCraft server using auto connect settings.
   */
  async AutoConnect() {
    const IP = world.getDynamicProperty("autoConnectIP");
    const Port = world.getDynamicProperty("autoConnectPort");
    const ServerKey = world.getDynamicProperty("autoConnectServerKey");

    if (
      IsNullOrWhitespace(IP) ||
      IsNullOrWhitespace(ServerKey) ||
      Port === undefined
    ) {
      throw "Error: Cannot connect. AutoConnect settings may not be setup properly!";
    }

    await this.Connect(IP, Port, ServerKey);
  }

  /**
   * @description Disconnects from a server with an optional reason.
   * @param {String} reason
   * @returns {Promise<void>}
   */
  async Disconnect(reason = "N.A.") {
    if (this.IsConnected) {
      this.NetworkRunner.Stop();

      const packet = new Logout();
      packet.Token = this.Token;

      this.SendPacket(packet);
      this.IsConnected = false;
      if (world.getDynamicProperty("broadcastVoipDisconnection"))
        world.sendMessage(`§cDisconnected from VOIP Server, Reason: ${reason}`);
    }
  }

  /**
   * @description Binds a player to a VoiceCraft client.
   * @param {Player} player
   * @param {Number} key
   * @returns {Promise<void>}
   */
  async Bind(player, key) {
    if (!this.IsConnected) throw "Could not bind, Server not connected/linked!";

    const packet = new Bind();
    packet.Gamertag = player.name;
    packet.PlayerKey = key;
    packet.PlayerId = player.id;
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.Accept) {
        return;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Binding Unsuccessful, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Binding Unsuccessful, ERROR: ${ex}`;
    }
  }

  /**
   * @description Binds a fake player to a VoiceCraft client.
   * @param {String} id
   * @param {Number} key
   * @returns {Promise<void>}
   */
  async BindFake(id, key) {
    if (!this.IsConnected)
      throw "Could not fake bind, Server not connected/linked!";

    const packet = new Bind();
    packet.Gamertag = id;
    packet.PlayerKey = key;
    packet.PlayerId = id;
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.Accept) {
        return;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Binding Unsuccessful, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Binding Unsuccessful, ERROR: ${ex}`;
    }
  }

  /**
   * @description Updates a fake player.
   * @param {String} id
   * @param {Player} player
   * @returns {Promise<void>}
   */
  async UpdateFake(id, player) {
    if (!this.IsConnected)
      throw "Could not update fake player, Server not connected/linked!";

    const packet = new Update();
    const fakePlayer = new VoiceCraftPlayer();
    fakePlayer.PlayerId = id;
    fakePlayer.CaveDensity = this.NetworkRunner.GetCaveDensity(player);
    fakePlayer.DimensionId = player.dimension.id;
    fakePlayer.Muffled = player.isInWater;
    fakePlayer.Location = player.location;
    fakePlayer.Rotation = player.getRotation().y;

    packet.Players = [fakePlayer];
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.AckUpdate) {
        return;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not update fake player, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not update fake player, ERROR: ${ex}`;
    }
  }

  /**
   * @description Gets all the available channels from the VoiceCraft server
   * @returns {Promise<Map<Number, Channel>}
   */
  async GetChannels() {
    if (!this.IsConnected)
      throw "Could not retrive channels, Server not connected/linked!";

    const packet = new GetChannels();
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.GetChannels) {
        /** @type {GetChannels} */
        const packetData = response;
        return packetData.Channels;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not retrive channels, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not retrive channels, ERROR: ${ex}`;
    }
  }

  /**
   * @description Get's the settings for a channel, returns default/main settings if no override for the specified channel was set.
   * @param {Number} channelId
   * @returns {Promise<ChannelOverride>}
   */
  async GetChannelSettings(channelId) {
    if (!this.IsConnected)
      throw "Could not retreive channel settings, Server not connected/linked!";

    const packet = new GetChannelSettings();
    packet.ChannelId = channelId;
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.GetChannelSettings) {
        /** @type {GetChannelSettings} */
        const packetData = response;
        const data = new ChannelOverride();

        data.ProximityDistance = packetData.ProximityDistance;
        data.ProximityToggle = packetData.ProximityToggle;
        data.VoiceEffects = packetData.VoiceEffects;
        return data;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not retreive channel settings, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not retreive channel settings, ERROR: ${ex}`;
    }
  }

  /**
   * @description Set's the settings for a channel.
   * @param {Number} channelId
   * @param {Number} proximityDistance
   * @param {Boolean} proximityToggle
   * @param {Boolean} voiceEffects
   * @param {Boolean} clearSettings
   * @returns {Promise<void>}
   */
  async SetChannelSettings(
    channelId,
    proximityDistance,
    proximityToggle,
    voiceEffects,
    clearSettings
  ) {
    if (!this.IsConnected)
      throw "Could not set channel settings, Server not connected/linked!";

    const packet = new SetChannelSettings();
    packet.ChannelId = channelId;
    packet.ProximityDistance = proximityDistance;
    packet.ProximityToggle = proximityToggle;
    packet.VoiceEffects = voiceEffects;
    packet.ClearSettings = clearSettings;
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.Accept) {
        return;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not set channel settings, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not set channel settings, ERROR: ${ex}`;
    }
  }

  /**
   * @description Get's the default settings.
   * @returns {Promise<ChannelOverride>}
   */
  async GetDefaultSettings() {
    if (!this.IsConnected)
      throw "Could not retreive default settings, Server not connected/linked!";

    const packet = new GetDefaultSettings();
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.GetDefaultSettings) {
        /** @type {GetDefaultSettings} */
        const packetData = response;
        const data = new ChannelOverride();

        data.ProximityDistance = packetData.ProximityDistance;
        data.ProximityToggle = packetData.ProximityToggle;
        data.VoiceEffects = packetData.VoiceEffects;
        return data;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not retreive default settings, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not retreive default settings, ERROR: ${ex}`;
    }
  }

  /**
   * @description Set's the default settings.
   * @param {Number} proximityDistance
   * @param {Boolean} proximityToggle
   * @param {Boolean} voiceEffects
   * @returns {Promise<void>}
   */
  async SetDefaultSettings(proximityDistance, proximityToggle, voiceEffects) {
    if (!this.IsConnected)
      throw "Could not set default settings, Server not connected/linked!";

    const packet = new SetDefaultSettings();
    packet.ProximityDistance = proximityDistance;
    packet.ProximityToggle = proximityToggle;
    packet.VoiceEffects = voiceEffects;
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.Accept) {
        return;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not set default settings, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not set default settings, ERROR: ${ex}`;
    }
  }

  /**
   * @description Get's a list of connected and binded player Id's.
   * @returns {Promise<String[]>}
   */
  async GetParticipants() {
    if (!this.IsConnected)
      throw "Could not retrieve participants, Server not connected/linked!";

    const packet = new GetParticipants();
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.GetParticipants) {
        /** @type {GetParticipants} */
        const packetData = response;
        return packetData.Players;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not retrieve participants, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not retrieve participants, ERROR: ${ex}`;
    }
  }

  /**
   * @description Helper to send a packet and expect an Accept response.
   * @param {MCCommPacket} packet
   * @param {String} actionName
   * @returns {Promise<void>}
   */
  async SendSimplePacket(packet, actionName) {
    if (!this.IsConnected)
      throw `Could not ${actionName}, Server not connected/linked!`;

    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.Accept) {
        return;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not ${actionName}, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not ${actionName}, ERROR: ${ex}`;
    }
  }

  /**
   * @description Disconnects a player from the VoiceCraft server.
   * @param {Player} player
   * @returns {Promise<void>}
   */
  async DisconnectPlayer(player) {
    const packet = new DisconnectParticipant();
    packet.PlayerId = player.id;
    await this.SendSimplePacket(packet, "disconnect player");
  }

  /**
   * @description Get's a player's VoiceCraft client bitmask.
   * @param {Player} player
   * @returns {Promise<Number>}
   */
  async GetPlayerBitmask(player) {
    if (!this.IsConnected)
      throw "Could not get player bitmask, Server not connected/linked!";

    const packet = new GetParticipantBitmask();
    packet.PlayerId = player.id;
    packet.Token = this.Token;

    try {
      const response = await this.SendPacket(packet);
      if (response.PacketId == PacketType.GetParticipantBitmask) {
        /** @type {GetParticipantBitmask} */
        const packetData = response;
        return packetData.Bitmask;
      } else {
        /** @type {Deny} */
        const packetData = response;
        throw `Could not get player bitmask, Reason: ${packetData.Reason}`;
      }
    } catch (ex) {
      throw `Could not get player bitmask, ERROR: ${ex}`;
    }
  }

  /**
   * @description Set's a player's VoiceCraft client bitmask.
   * @param {Player} player
   * @param {Number} bitmask
   * @param {Boolean} ignoreDataBitmask
   * @returns {Promise<void>}
   */
  async SetPlayerBitmask(player, bitmask, ignoreDataBitmask) {
    const packet = new SetParticipantBitmask();
    packet.PlayerId = player.id;
    packet.IgnoreDataBitmask = ignoreDataBitmask;
    packet.Bitmask = new Uint32Array([bitmask])[0];
    await this.SendSimplePacket(packet, "set player bitmask");
  }

  /**
   * @description Server Mutes a player's VoiceCraft client.
   * @param {Player} player
   * @returns {Promise<void>}
   */
  async MutePlayer(player) {
    const packet = new MuteParticipant();
    packet.PlayerId = player.id;
    await this.SendSimplePacket(packet, "mute player");
  }

  /**
   * @description Server Unmutes a player's VoiceCraft client.
   * @param {Player} player
   * @returns {Promise<void>}
   */
  async UnmutePlayer(player) {
    const packet = new UnmuteParticipant();
    packet.PlayerId = player.id;
    await this.SendSimplePacket(packet, "unmute player");
  }

  /**
   * @description Server Deafens a player's VoiceCraft client.
   * @param {Player} player
   * @returns {Promise<void>}
   */
  async DeafenPlayer(player) {
    const packet = new DeafenParticipant();
    packet.PlayerId = player.id;
    await this.SendSimplePacket(packet, "deafen player");
  }

  /**
   * @description Server Undeafens a player's VoiceCraft client.
   * @param {Player} player
   * @returns {Promise<void>}
   */
  async UndeafenPlayer(player) {
    const packet = new UndeafenParticipant();
    packet.PlayerId = player.id;
    await this.SendSimplePacket(packet, "undeafen player");
  }

  /**
   * @description AND modify's a player's VoiceCraft client bitmask.
   * @param {Player} player
   * @param {Number} bitmask
   * @returns {Promise<void>}
   */
  async ANDModPlayerBitmask(player, bitmask) {
    const packet = new ANDModParticipantBitmask();
    packet.PlayerId = player.id;
    packet.Bitmask = new Uint32Array([bitmask])[0];
    await this.SendSimplePacket(packet, "AND mod player bitmask");
  }

  /**
   * @description OR modify's a player's VoiceCraft client bitmask.
   * @param {Player} player
   * @param {Number} bitmask
   * @returns {Promise<void>}
   */
  async ORModPlayerBitmask(player, bitmask) {
    const packet = new ORModParticipantBitmask();
    packet.PlayerId = player.id;
    packet.Bitmask = new Uint32Array([bitmask])[0];
    await this.SendSimplePacket(packet, "OR mod player bitmask");
  }

  /**
   * @description XOR modify's a player's VoiceCraft client bitmask.
   * @param {Player} player
   * @param {Number} bitmask
   * @returns {Promise<void>}
   */
  async XORModPlayerBitmask(player, bitmask) {
    const packet = new XORModParticipantBitmask();
    packet.PlayerId = player.id;
    packet.Bitmask = new Uint32Array([bitmask])[0];
    await this.SendSimplePacket(packet, "XOR mod player bitmask");
  }

  /**
   * @description Moves a player to a channel.
   * @param {Player} player
   * @param {Number} channelId
   */
  async ChannelMovePlayer(player, channelId) {
    const packet = new ChannelMove();
    packet.PlayerId = player.id;
    packet.ChannelId = channelId;
    await this.SendSimplePacket(packet, "move player to channel");
  }

  /**
   * @description Sends an MCCommPacket.
   * @param {MCCommPacket} Packet
   * @returns {Promise<MCCommPacket}
   */
  async SendPacket(packet) {
    const request = new HttpRequest(`http://${this.IPAddress}:${this.Port}/`);
    request.setBody(JSON.stringify(packet));
    request.setMethod(HttpRequestMethod.Post);
    request.setHeaders([new HttpHeader("Content-Type", "application/json")]);

    const response = await http.request(request);
    if (response.status == 200) {
      return JSON.parse(response.body);
    } else {
      throw `Sending HTTP Packet Failed, Reason: HTTP_EXCEPTION, STATUS_CODE: ${response.status}`;
    }
  }
}

/**
 * @description Checks if the string input is null or whitespace.
 * @param {String} input
 * @returns
 */
function IsNullOrWhitespace(input) {
  if (typeof input === "undefined" || input == null) return true;

  return input.replace(/\s/g, "").length < 1;
}

export { Network };
