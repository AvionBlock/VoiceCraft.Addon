import { NetSerializable } from "./NetSerializable";
import { NetDataReader } from "./NetDataReader";
import { NetDataWriter } from "./NetDataWriter";
import { Vector3 } from "../data/Vector3";
import { Quaternion } from "../data/Quaternion";
import { EntityType } from "../VoiceCraftEntity";

export const McApiPacketType = Object.freeze({
  unknown: 0,
  login: 1,
  logout: 2,
  ping: 3,
  accept: 4,
  deny: 5,
  setEffect: 6,
  audio: 7,
  setTitle: 8,
  setDescription: 9,
  entityCreated: 10,
  entityDestroyed: 11,
  setName: 12,
  setMute: 13,
  setDeafen: 14,
  setTalkBitmask: 15,
  setListenBitmask: 16,
  setPosition: 17,
  setRotation: 18,
});

export class McApiPacket extends NetSerializable {
  /** @type { Number } */
  packetId = McApiPacketType.unknown;
}

export class LoginPacket extends McApiPacket {
  /** @type { String } */
  loginToken;
  /** @type { Number } */
  major;
  /** @type { Number } */
  minor;
  /** @type { Number } */
  build;

  constructor(loginToken, major, minor, build) {
    super();
    this.packetId = McApiPacketType.login;
    this.loginToken = loginToken;
    this.major = major;
    this.minor = minor;
    this.build = build;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.loginToken);
    writer.putInt(this.major);
    writer.putInt(this.minor);
    writer.putInt(this.build);
  }
}

export class PingPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken = "") {
    super();
    this.packetId = McApiPacketType.ping;
    this.sessionToken = sessionToken;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
  }
}

export class LogoutPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken = "") {
    super();
    this.packetId = McApiPacketType.logout;
    this.sessionToken = sessionToken;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
  }
}

export class AcceptPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken = "") {
    super();
    this.packetId = McApiPacketType.accept;
    this.sessionToken = sessionToken;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
  }
}

export class DenyPacket extends McApiPacket {
  /** @type { String } */
  reasonKey;

  constructor(reasonKey) {
    super();
    this.packetId = McApiPacketType.deny;
    this.reasonKey = reasonKey;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.reasonKey);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.reasonKey = reader.getString();
  }
}

//TODO
export class SetEffectPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken) {
    super();
    this.packetId = McApiPacketType.setEffect;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
  }
}

export class AudioPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;
  /** @type { Number } */
  id;
  /** @type { Number } */
  timeStamp;
  /** @type { Number } */
  frameLoudness;
  /** @type { Number } */
  length;
  /** @type { Uint8Array } */
  data;

  constructor(sessionToken, id, timeStamp, frameLoudness, length, data) {
    super();
    this.packetId = McApiPacketType.audio;
    this.sessionToken = sessionToken;
    this.id = id;
    this.timeStamp = timeStamp;
    this.frameLoudness = frameLoudness;
    this.length = length;
    this.data = data;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
    writer.putInt(this.id);
    writer.putUint(this.timeStamp);
    writer.putFloat(this.frameLoudness);
    writer.putBytes(this.data, 0, this.length);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
    this.id = reader.getInt();
    this.timeStamp = reader.getUint();
    this.frameLoudness = reader.getFloat();
    this.length = reader.availableBytes;
    if (this.length > 1000)
      throw new RangeError(
        `Array length exceeds maximum number of bytes per packet! Got ${Length} bytes.`
      );
    this.data = new Uint8Array(this.length);
    reader.getBytes(this.data, this.length);
  }
}

export class SetTitlePacket extends McApiPacket {
  /** @type { String } */
  sessionToken;
  /** @type { Number } */
  id;
  /** @type { String } */
  value;

  constructor(sessionToken, id, value) {
    super();
    this.packetId = McApiPacketType.setTitle;
    this.sessionToken = sessionToken;
    this.id = id;
    this.value = value;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
    writer.putInt(this.id);
    writer.putString(this.value);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
    this.id = reader.getInt();
    this.value = reader.getString();
  }
}

export class SetDescriptionPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;
  /** @type { Number } */
  id;
  /** @type { String } */
  value;

  constructor(sessionToken, id, value) {
    super();
    this.packetId = McApiPacketType.setDescription;
    this.sessionToken = sessionToken;
    this.id = id;
    this.value = value;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
    writer.putInt(this.id);
    writer.putString(this.value);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
    this.id = reader.getInt();
    this.value = reader.getString();
  }
}

export class EntityCreatedPacket extends McApiPacket {
  /** @type { String } */
  sessionToken;
  /** @type { Number } */
  id;
  /** @type { Number } */
  entityType;
  /** @type { Number } */
  lastSpoke;
  /** @type { Boolean } */
  destroyed;
  /** @type { String } */
  worldId;
  /** @type { String } */
  name;
  /** @type { Boolean } */
  muted;
  /** @type { Boolean } */
  deafened;
  /** @type { Number } */
  talkBitmask;
  /** @type { Number } */
  listenBitmask;
  /** @type { Vector3 } */
  position;
  /** @type { Quaternion } */
  rotation;
  /** @type { String | undefined } */
  userGuid;
  /** @type { String | undefined } */
  serverUserGuid;
  /** @type { String | undefined } */
  locale;
  /** @type { Number | undefined } */
  positioningType;

  constructor(
    sessionToken,
    id,
    entityType,
    lastSpoke,
    destroyed,
    worldId,
    name,
    muted,
    deafened,
    talkBitmask,
    listenBitmask,
    position,
    rotation,
    userGuid,
    serverUserGuid,
    locale,
    positioningType
  ) {
    super();
    this.sessionToken = sessionToken;
    this.id = id;
    this.entityType = entityType;
    this.lastSpoke = lastSpoke;
    this.destroyed = destroyed;
    this.worldId = worldId;
    this.name = name;
    this.muted = muted;
    this.deafened = deafened;
    this.talkBitmask = talkBitmask;
    this.listenBitmask = listenBitmask;
    this.position = position;
    this.rotation = rotation;
    this.userGuid = userGuid;
    this.serverUserGuid = serverUserGuid;
    this.locale = locale;
    this.positioningType = positioningType;
  }

  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {
    writer.putString(this.sessionToken);
    writer.putInt(this.id);
    writer.putByte(this.entityType);
    writer.putDouble(this.lastSpoke);
    writer.putBool(this.destroyed);
    writer.putString(this.worldId);
    writer.putString(this.name);
    writer.putBool(this.muted);
    writer.putBool(this.deafened);
    writer.putUlong(this.talkBitmask);
    writer.putUlong(this.listenBitmask);
    writer.putFloat(this.position.x);
    writer.putFloat(this.position.y);
    writer.putFloat(this.position.z);
    writer.putFloat(this.rotation.x);
    writer.putFloat(this.rotation.y);
    writer.putFloat(this.rotation.z);
    writer.putFloat(this.rotation.w);

    if(this.entityType !== EntityType.Network) return;
    if(this.userGuid === undefined || this.serverUserGuid === undefined || this.locale === undefined || this.positioningType === undefined)
      throw new Error("Invalid Packet!");

    writer.putString(this.userGuid);
    writer.putString(this.serverUserGuid);
    writer.putString(this.locale);
    writer.putByte(this.positioningType);
  }

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {
    this.sessionToken = reader.getString();
    this.id = reader.getInt();
    this.entityType = reader.getByte();
    this.lastSpoke = reader.getDouble();
    this.destroyed = reader.getBool();
    this.worldId = reader.getString();
    this.name = reader.getString();
    this.muted = reader.getBool();
    this.deafened = reader.getBool();
    this.talkBitmask = reader.getUlong();
    this.listenBitmask = reader.getUlong();
    this.position = new Vector3(reader.getFloat(), reader.getFloat(), reader.getFloat());
    this.rotation = new Quaternion(reader.getFloat(), reader.getFloat(), reader.getFloat(), reader.getFloat());

    if(this.entityType !== EntityType.Network) return;
    this.userGuid = reader.getString()
    this.serverUserGuid = reader.getString();
    this.locale = reader.getString();
    this.positioningType = reader.getByte();
  }
}
