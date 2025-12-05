import { world, system, Player } from "@minecraft/server";
import { http } from "@minecraft/server-net";
import { Network } from "./Network";
import { Direction } from "../Utils/Constants";
import {
  Deny,
  PacketType,
  Update,
  AckUpdate,
  VoiceCraftPlayer,
} from "./MCCommAPI";

class NetworkRunner {
  /**
   * @param {Network} network
   */
  constructor(network) {
    /** @type {Network} */
    this.Network = network;
    /** @type {String[]} */
    this.DeadPlayers = [];
    /** @type {Number} */
    this.UpdateLoop = 0;
    /** @type {Number} */
    this.ReconnectRetries = 0;

    /** @type {Set<String>} */
    this.CaveBlocks = new Set([
      "minecraft:stone",
      "minecraft:diorite",
      "minecraft:granite",
      "minecraft:deepslate",
      "minecraft:tuff",
    ]);

    // Cache for expensive calculations (EchoFactor, Muffled)
    /** @type {WeakMap<Player, {echo: number, muffled: boolean, lastUpdate: number}>} */
    this.PlayerCache = new WeakMap();
  }

  /**
   * @description Starts the update looper.
   */
  Start() {
    // Run every 2 ticks for smooth movement updates.
    // Heavy logic will be staggered inside the loop.
    this.UpdateLoop = system.runInterval(() => this.Update(), 2);
  }

  /**
   * @description Stops the update looper.
   */
  Stop() {
    if (this.UpdateLoop != 0) {
      system.clearRun(this.UpdateLoop);
      this.UpdateLoop = 0;
    }
  }

  /**
   * @description Calculates or retrieves cached cave density.
   * @param {Player} player
   * @returns {Number}
   */
  GetCaveDensity(player) {
    if (!this.Network.IsConnected) return 0.0;

    // Check cache
    let cache = this.PlayerCache.get(player);
    const currentTick = system.currentTick;

    // Update heavy logic only every 20 ticks (~1 second) or if no cache exists
    if (!cache || (currentTick - cache.lastUpdate) > 20) {
        const dimension = player.dimension;
        const headLocation = player.getHeadLocation();
        
        const check = (dir, dist) => {
            try {
                const hit = dimension.getBlockFromRay(headLocation, dir, { maxDistance: dist });
                return (hit && hit.block && this.CaveBlocks.has(hit.block.typeId)) ? 1 : 0;
            } catch { return 0; }
        };

        try {
            let total = 0;
            total += check(Direction.Up, 50);
            total += check(Direction.Left, 20);
            total += check(Direction.Right, 20);
            total += check(Direction.Forward, 20);
            total += check(Direction.Backward, 20);
            total += check(Direction.Down, 50);
            
            const echo = total / 6;
            const muffled = dimension.getBlock(headLocation)?.isLiquid ?? false;

            cache = { echo, muffled, lastUpdate: currentTick };
            this.PlayerCache.set(player, cache);
        } catch(ex) {
            return 0.0;
        }
    }

    return cache.echo;
  }

  /**
   * @description Sends an update to the VoiceCraft server.
   * @returns {Promise<void>}
   */
  async Update() {
    if (!this.Network.IsConnected) {
        if (this.UpdateLoop != 0) this.Stop();
        return;
    }

    try {
      const players = world.getAllPlayers();
      const playerList = new Array(players.length);

      for (let i = 0; i < players.length; i++) {
          const plr = players[i];
          const player = new VoiceCraftPlayer();
          player.PlayerId = plr.id;
          player.DimensionId = plr.dimension.id;
          player.Location = plr.getHeadLocation();
          player.Rotation = plr.getRotation().y;
          
          // Use optimized getter with caching
          player.EchoFactor = this.GetCaveDensity(plr);
          
          // Use cached muffled state if available, otherwise safe check
          const cache = this.PlayerCache.get(plr);
          player.Muffled = cache ? cache.muffled : false;
          
          player.IsDead = this.DeadPlayers.includes(plr.id);
          playerList[i] = player;
      }

      const packet = new Update();
      packet.Players = playerList;
      packet.Token = this.Network.Token;

      const response = await this.Network.SendPacket(packet);
      if (!this.Network.IsConnected) return;

      if (response.PacketId == PacketType.Deny) {
          const packetData = response;
          this.Network.IsConnected = false;
          http.cancelAll(packetData.Reason);
          this.Stop();
      }
    } catch (ex) {
        this.HandleDisconnection(ex);
    }
  }

  HandleDisconnection(ex) {
    if (!this.Network.IsConnected) return;

    console.warn("Lost Connection From VOIP Server.");
    this.Network.IsConnected = false;

    http.cancelAll("Lost Connection From VOIP Server.");
    if (this.UpdateLoop != 0) {
        system.clearRun(this.UpdateLoop);
        this.UpdateLoop = 0;
    }

    if (world.getDynamicProperty("autoReconnect")) {
      if (world.getDynamicProperty("broadcastVoipDisconnection")) {
        world.sendMessage("§cLost Connection From VOIP Server. Attempting Reconnection...");
      }
      this.ReconnectRetries = 0;
      this.Reconnect();
    } else if (world.getDynamicProperty("broadcastVoipDisconnection")) {
      world.sendMessage("§cLost Connection From VOIP Server.");
    }
  }

  Reconnect() {
    if (this.ReconnectRetries < 5) {
      this.ReconnectRetries++;
      console.warn(`Reconnecting to server... Attempt: ${this.ReconnectRetries}`);
      
      this.Network.Connect(
        this.Network.IPAddress,
        this.Network.Port,
        this.Network.Key
      )
        .then(() => {
          console.warn("Successfully reconnected to VOIP server.");
          if (world.getDynamicProperty("broadcastVoipDisconnection"))
            world.sendMessage("§aSuccessfully reconnected to VOIP server.");
        })
        .catch(() => {
          if (this.ReconnectRetries < 5) {
            console.warn("Connection failed, Retrying...");
            system.runTimeout(() => this.Reconnect(), 100); // Add small delay between retries
            return;
          }
          console.error("Failed to reconnect to VOIP server.");
          if (world.getDynamicProperty("broadcastVoipDisconnection"))
            world.sendMessage("§cFailed to reconnect to VOIP server...");
        });
    }
  }
}

export { NetworkRunner };
