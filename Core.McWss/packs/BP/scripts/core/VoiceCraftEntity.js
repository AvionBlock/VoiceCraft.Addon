import NetSerializable from "../interfaces/NetSerializable";
import Quaternion from "../interfaces/Quaternion";
import Vector3 from "../interfaces/Vector3";
import VoiceCraftWorld from "./VoiceCraftWorld";

export const EntityType = Object.freeze({
  Unknown: 0,
  Server: 1,
  Network: 2,
});

export default class VoiceCraftEntity extends NetSerializable {
  //Events
  #onWorldIdUpdated = new WorldIdUpdatedEvent();

  //Public Events
  get onWorldIdUpdated() {
    return this.#onWorldIdUpdated;
  }

  get id() {
    return this.#id;
  }
  get world() {
    return this.#world;
  }
  get entityType() {
    return this.#entityType;
  }
  get loudness() {
    return this.#loudness;
  }
  get isSpeaking() {
    return Date.now() - this.#lastSpoke < 200;
  }
  get lastSpoke() {
    return this.#lastSpoke;
  }
  get destroyed() {
    return this.#destroyed;
  }

  //Other Information.
  get worldId() {
    return this.#worldId;
  }
  set worldId(value) {
    if (typeof value !== "string" || value === this.#worldId) return;
    this.#worldId = value;
    this.#onWorldIdUpdated.trigger(value, this);
  }

  get name() {
    return this.#name;
  }
  set name(value) {
    if (typeof value === "string") this.#name = value;
  }

  get muted() {
    return this.#muted;
  }
  set muted(value) {
    if (typeof value === "boolean") this.#muted = value;
  }

  get deafened() {
    return this.#deafened;
  }
  set deafened(value) {
    if (typeof value === "boolean") this.#deafened = value;
  }

  get talkBitmask() {
    return this.#talkBitmask;
  }
  set talkBitmask(value) {
    if (typeof value === "number") this.#talkBitmask = value;
  }

  get listenBitmask() {
    return this.#listenBitmask;
  }
  set listenBitmask(value) {
    if (typeof value === "number") this.#listenBitmask = value;
  }

  get position() {
    return this.#position;
  }
  set position(value) {
    if (value instanceof Vector3) this.#position = value;
  }

  get rotation() {
    return this.#rotation;
  }
  set rotation(value) {
    if (value instanceof Quaternion) this.#rotation = value;
  }

  /** @type { Number } */
  #id;
  /** @type { VoiceCraftWorld } */
  #world;
  /** @type { Number } */
  #entityType;
  /** @type { Number } */
  #loudness;
  /** @type { Number } */
  #lastSpoke;
  /** @type { Boolean } */
  #destroyed;

  //Other Information
  /** @type { String } */
  #worldId;
  /** @type { String } */
  #name;
  /** @type { Boolean } */
  #muted;
  /** @type { Boolean } */
  #deafened;
  /** @type { Number } */
  #talkBitmask;
  /** @type { Number } */
  #listenBitmask;
  /** @type { Vector3 } */
  #position;
  /** @type { Quaternion } */
  #rotation;

  constructor(id, world) {
    if (typeof id === "number")
      throw new TypeError("Parameter id is not a number!");
    if (!(world instanceof VoiceCraftWorld))
      throw new TypeError(
        "Parameter world is not an instance of VoiceCraftWorld!"
      );

    this.#id = id;
    this.#world = world;
    this.#entityType = EntityType.Server;
    this.#loudness = 0.0;
    this.#lastSpoke = 0;
    this.#destroyed = false;
    this.#worldId = "";
    this.#name = "";
    this.#muted = false;
    this.#deafened = false;
    this.#talkBitmask = 0;
    this.#listenBitmask = 0;
    this.#position = new Vector3();
    this.#rotation = new Quaternion();
  }
}

//Event Types
export class WorldIdUpdatedEvent {
  /** @type { WorldIdUpdatedCallback[] } */
  #registers = [];

  /**
   * @callback WorldIdUpdatedCallback
   * @param { { value: String, entity: VoiceCraftEntity } } value
   */

  /**
   * @param { WorldIdUpdatedCallback } callback
   */
  subscribe(callback) {
    this.#registers.push(callback);
  }

  /**
   * @param { WorldIdUpdatedCallback } callback
   */
  unsubscribe(callback) {
    const index = this.#registers.findIndex((x) => x === callback);
    if (index < 0) return;
    this.#registers = this.#registers.splice(index, 1);
  }

  /**
   * @param { String } value
   * @param { VoiceCraftEntity } entity
   */
  trigger(value, entity) {
    for (let callback of this.#registers) {
      try {
        callback({ value: value, entity: entity });
      } catch {
        // Do Nothing
      }
    }
  }
}
