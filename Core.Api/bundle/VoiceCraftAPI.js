class NetSerializable {
  /**
   * @param { NetDataWriter } writer
   */
  serialize(writer) {}

  /**
   * @param { NetDataReader } reader
   */
  deserialize(reader) {}
}

class Quaternion {
  /**
   * @param { Number } x
   * @param { Number } y
   * @param { Number } z
   * @param { Number } w
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /** @type { Number } */
  x;
  /** @type { Number } */
  y;
  /** @type { Number } */
  z;
  /** @type { Number } */
  w;

  /**
   * @param { Quaternion } value
   * @returns { Boolean }
   */
  equals(value) {
    if (!(value instanceof Quaternion)) return false;
    if (
      value.x !== this.x ||
      value.y !== this.y ||
      value.z !== this.z ||
      value.w !== this.w
    )
      return false;
    return true;
  }
}

class Vector3 {
  /**
   * @param { Number } x
   * @param { Number } y
   * @param { Number } z
   */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /** @type { Number } */
  x;
  /** @type { Number } */
  y;
  /** @type { Number } */
  z;

  /**
   * @param { Vector3 } value
   * @returns { Boolean }
   */
  equals(value) {
    if (!(value instanceof Vector3)) return false;
    if (value.x !== this.x || value.y !== this.y || value.z !== this.z)
      return false;
    return true;
  }
}

const EntityType = Object.freeze({
  Unknown: 0,
  Server: 1,
  Network: 2,
});

class VoiceCraftEntity extends NetSerializable {
  //Public Events
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
    if (value instanceof Quaternion && value !== this.#rotation) return;
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

class VoiceCraftWorld {
  /** @type { MapIterator<VoiceCraftEntity> } */
  get entities() {
    return this.#_entities.values();
  }

  /** @type { Map<Number, VoiceCraftEntity> } */
  #_entities;

  constructor() {
    this.#_entities = new Map();
  }

  dispose() {
    this.clearEntities();

  }

  reset() {
    this.clearEntities();
  }

  createEntity()
  {
    const id = this.getLowestAvailableId();
    const entity = new VoiceCraftEntity(id, this);
    if(this.#_entities.has(id))
        throw new Error("Failed to create entity!");
    this.#_entities.set(id, entity);

    //Setup Entity.
    return entity;
  }

  /** @param { VoiceCraftEntity } entity */
  addEntity(entity)
  {
    if(this.#_entities.has(entity.id))
        throw new Error("Failed to add entity! An entity with the same id already exists!");
    if (entity.world != this)
        throw new Error("Failed to add entity! The entity is not associated with this world!");

    this.#_entities.set(entity.id, entity);
    //Setup Entity.
  }

  getEntity(id)
  {
    return this.#_entities.get(id);
  }

  destroyEntity(id)
  {
    if (!this.#_entities.has(id))
        throw new Error("Failed to destroy entity! Entity not found!");

    this.#_entities.delete(id);

    //Destroy Entity.
  }

  clearEntities()
  {
    const entities = Array.from(this.#_entities);
    this.#_entities.clear();
    entities.forEach(entity => {
        //Destroy Entity
    });
  }

  /** @param { VoiceCraftEntity } entity */
  #removeEntity(entity)
  {
      //Remove Event Subscription
      if(!this.#_entities.has(entity.id)) return;
      this.#_entities.delete(entity.id);
      //Invoke
  }
  
  getLowestAvailableId()
  {
    for(let i = 0; i < 2147483647; i++)
    {
        if(!this.#_entities.has(i))
            return i;
    }

    throw new Error("Could not find an available id!");
  }
}

class Event {
  /** @type { ((data: T)=>void)[] } */
  #listeners = [];

  /**
   * @description Subscribes to the event.
   * @param { ((data: T)=>void) } callback
   */
  subscribe(callback) {
    this.#listeners.push(callback);
  }

  /**
   * @description Unsubscribes a specific callback instance from the event.
   * @param { ((data: T)=>void) } callback
   */
  unsubscribe(callback) {
    const index = this.#listeners.findIndex((x) => x === callback);
    if (index < 0) return;
    this.#listeners = this.#listeners.splice(index, 1);
  }

  /**
   * @description Triggers the event and calls all listeners.
   * @param { T } data
   */
  emit(data) {
    for (let callback of this.#listeners) {
      try {
        callback(data);
      } catch {
        //Do Nothing
      }
    }
  }
}

class UTF8 {
  constructor() {
    throw new Error("Cannot initialize a static class!");
  }

  /**
   * @description Encodes a string into a Uint8Array.
   * @param { String } s
   * @returns { Uint8Array | undefined }
   */
  static getBytes(s) {
    if (typeof s !== "string")
      throw new TypeError("Parameter s is not a string!");

    const byteCount = this.getByteCount(s);
    if (byteCount === 0) return undefined;

    const bytes = new Uint8Array(byteCount);
    this.setBytes(s, 0, s.length, bytes, 0);
    return bytes;
  }

  /**
   * @description Encodes a range of characters from a string into a Uint8Array.
   * @param { String } s
   * @param { Number } charIndex
   * @param { Number } charCount
   * @param { Uint8Array } bytes
   * @param { Number } byteIndex
   * @returns { Number } The number of bytes that were successfully encoded.
   */
  static setBytes(s, charIndex, charCount, bytes, byteIndex) {
    if (typeof s !== "string")
      throw new TypeError("Parameter s is not a string!");
    if (typeof charIndex !== "number")
      throw new TypeError("Parameter charIndex is not a number!");
    if (typeof charCount !== "number")
      throw new TypeError("Parameter charCount is not a number!");
    if (!(bytes instanceof Uint8Array))
      throw new TypeError("Parameter bytes is not an instance of Uint8Array!");
    if (typeof byteIndex !== "number")
      throw new TypeError("Parameter byteIndex is not a number!");
    if (s.length - charIndex < charCount)
      throw new RangeError("Argument out of range!", { cause: "s" });
    if (byteIndex > bytes.length)
      throw new RangeError(
        "Byte Index must be less than or equal to bytes.length!",
        { cause: "byteIndex" }
      );

    charCount = Math.min(charCount, s.length);
    let bytesEncoded = 0;
    for (let i = charIndex; i < charIndex + charCount; i++) {
      const charCode = s.charCodeAt(i);
      const byteCount = this.setBytesFromCharCode(charCode, bytes, byteIndex);
      if (byteCount === undefined) continue;
      bytesEncoded += byteCount;
      byteIndex += byteCount;
    }

    return bytesEncoded;
  }

  /**
   * @description Decodes a range of bytes from a Uint8Array into a string.
   * @param { Uint8Array } bytes
   * @param { Number } byteIndex
   * @param { Number } count
   * @returns { String } The decoded string.
   */
  static getString(bytes, index, count) {
    if (!(bytes instanceof Uint8Array))
      throw new TypeError("Parameter bytes is not an instance of Uint8Array!");
    if (typeof index !== "number")
      throw new TypeError("Parameter index is not a number!");
    if (typeof count !== "number")
      throw new TypeError("Parameter count is not a number!");
    if (bytes.length - index < count)
      throw new RangeError("Count argument out of range!");

    /** @type { Number[] } */
    const charCodes = [];
    const maxIndex = count + index;
    while (index < maxIndex) {
      const charCode = this.getCharCodeFromBytes(bytes, index);
      if (charCode !== undefined) {
        charCodes.push(charCode);
        index += this.getByteCountFromCharCode(charCode); //We know it's a valid utf8 character.
        continue;
      }

      index++;
    }

    return String.fromCharCode.apply(null, charCodes);
  }

  //#region Byte Count Stuff
  /**
   * @description Calculates the exact number of bytes required to encode the string.
   * @param { String } chars
   * @returns { Number } The number of bytes that is required to encode the string.
   */
  static getByteCount(chars) {
    if (typeof chars !== "string")
      throw new TypeError("Parameter chars is not a string!");

    let charCount = 0;
    for (let i = 0; i < chars.length; i++) {
      const byteCount = this.getByteCountFromCharCode(chars.charCodeAt(i));
      if (byteCount === undefined) continue;
      charCount += byteCount;
    }

    return charCount;
  }
  //#endregion

  /**
   * @description Calculates the maximum number of bytes produced by encoding the specified number of characters.
   * @param { Number } charCount
   * @returns { Number } The maximum possible number of bytes required to encode.
   */
  static getMaxByteCount(charCount) {
    if (typeof charCount !== "number")
      throw new TypeError("Parameter charCount is not a number!");

    return (charCount + 1) * 3;
  }

  //#region Charcode Stuff
  /**
   * @description Calculates the required numbers of bytes to encode the specified char code.
   * @param { Number } charCode
   * @returns { Number | undefined }
   */
  static getByteCountFromCharCode(charCode) {
    if (typeof charCode !== "number")
      throw new TypeError("Parameter charCode is not a number!");

    if (charCode <= 0x7f) {
      return 1;
    } else if (charCode <= 0x7ff) {
      return 2;
    } else if (charCode <= 0xffff) {
      return 3;
    }
    return undefined;
  }

  /**
   * @description Get's a Uint8Array with the encoded bytes for the specified charcode.
   * @param { Number } charCode
   * @returns { Uint8Array | undefined }
   */
  static getBytesFromCharCode(charCode) {
    if (typeof charCode !== "number")
      throw new TypeError("Parameter charCode is not a number!");

    const byteCount = this.getByteCountFromCharCode(charCode);
    if (byteCount === undefined) return undefined;

    const bytes = new Uint8Array(byteCount);
    this.setBytesFromCharCode(charCode, bytes, 0);
    return bytes;
  }

  /**
   * @description Sets a Uint8Array with the encoded bytes for the specified charcode.
   * @param { Number } charCode
   * @param { Uint8Array } bytes
   * @param { Number } index
   * @returns { Number | undefined } The number of bytes encoded.
   */
  static setBytesFromCharCode(charCode, bytes, index) {
    if (typeof charCode !== "number")
      throw new TypeError("Parameter charCode is not a number!");
    if (!(bytes instanceof Uint8Array))
      throw new TypeError("Parameter bytes is not an instance of Uint8Array!");
    if (typeof index !== "number")
      throw new TypeError("Parameter index is not a number!");

    let byteCount = this.getByteCountFromCharCode(charCode);
    switch (byteCount) {
      case 1:
        if (bytes.length < index) {
          byteCount = undefined;
          break;
        }

        bytes[index] = charCode;
        break;
      case 2:
        if (bytes.length < index + 1) {
          byteCount = undefined;
          break;
        }

        bytes[index++] = 0xc0 | (charCode >> 6);
        bytes[index] = 0x80 | (charCode & 0x3f);
        break;
      case 3:
        if (bytes.length < index + 2) {
          byteCount = undefined;
          break;
        }

        bytes[index++] = 0xe0 | (charCode >> 12);
        bytes[index++] = 0x80 | ((charCode >> 6) & 0x3f);
        bytes[index] = 0x80 | (charCode & 0x3f);
        break;
    }

    return byteCount;
  }

  /**
   * @description Get's a charcode from the specified Uint8Array at index.
   * @param { Uint8Array } bytes
   * @param { Number } index
   * @returns { Number | undefined }
   */
  static getCharCodeFromBytes(bytes, index) {
    if (!(bytes instanceof Uint8Array))
      throw new TypeError("Parameter bytes is not an instance of Uint8Array!");
    if (typeof index !== "number")
      throw new TypeError("Parameter index is not a number!");
    if (bytes.length < index)
      throw new RangeError("Index argument out of range!");

    const byte = bytes[index];
    if ((byte & 0x80) === 0) {
      return byte;
    } else if ((byte & 0xe0) == 0xc0) {
      const byte2 = bytes[++index];
      return ((byte & 0x1f) << 6) | (byte2 & 0x3f);
    } else if ((byte & 0xf0) == 0xe0) {
      const byte2 = bytes[++index];
      const byte3 = bytes[++index];
      return ((byte & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f);
    } else if ((byte & 0xf8) == 0xf0) {
      const byte2 = bytes[++index];
      const byte3 = bytes[++index];
      const byte4 = bytes[++index];
      return (
        ((byte & 0x0f) << 18) |
        ((byte2 & 0x3f) << 12) |
        ((byte3 & 0x3f) << 6) |
        (byte4 & 0x3f)
      );
    }

    return undefined;
  }
  //#endregion
}

class NetDataWriter {
  /**
   * @description Contains the raw buffer data the writer holds.
   * @type { Uint8Array }
   */
  get data() {
    return this.#_data;
  }
  /**
   * @description Contains the total length of the data that was written.
   * @type { Number }
   */
  get length() {
    return this.#_offset;
  }
  /**
   * @description Determines whether the internal buffer should automatically resize when inputting new data.
   * @type { Boolean }
   */
  autoResize = true;

  /** @type { Uint8Array } */
  #_data;
  /** @type { Number } */
  #_offset = 0;
  /** @type { DataView } */
  #_dataView;

  /**
   * @description Creates a new writer.
   * @param { ArrayBuffer } buffer
   */
  constructor(buffer = undefined) {
    if (buffer !== undefined) this.#_data = buffer;
    else this.#_data = new Uint8Array();
    this.#_dataView = new DataView(this.#_data.buffer);
  }

  /**
   * @description Resizes the internal buffer to the new size if required.
   * @param { Number } newSize
   */
  resizeIfNeeded(newSize) {
    if (!this.autoResize || this.#_data.length >= newSize) return;

    newSize = Math.max(newSize, this.#_data.length * 2);
    const newBuffer = new Uint8Array(newSize);
    newBuffer.set(this.#_data);

    this.#_data = newBuffer;
    this.#_dataView = new DataView(this.#_data.buffer); //new data view.
  }

  /**
   * @description Resets the writer.
   */
  reset() {
    this.#_offset = 0;
  }

  /**
   * @description Writes a float value into the buffer.
   * @param { Number } value
   */
  putFloat(value) {
    this.resizeIfNeeded(this.#_offset + 4);
    this.#_dataView.setFloat32(this.#_offset, value, true);
    this.#_offset += 4;
  }

  /**
   * @description Writes a double value into the buffer.
   * @param { Number } value
   */
  putDouble(value) {
    this.resizeIfNeeded(this.#_offset + 8);
    this.#_dataView.setFloat64(this.#_offset, value, true);
    this.#_offset += 8;
  }

  /**
   * @description Writes a signed byte value into the buffer.
   * @param { Number } value
   */
  putSbyte(value) {
    this.resizeIfNeeded(this.#_offset + 1);
    this.#_dataView.setInt8(this.#_offset, value);
    this.#_offset += 1;
  }

  /**
   * @description Writes a short value into the buffer.
   * @param { Number } value
   */
  putShort(value) {
    this.resizeIfNeeded(this.#_offset + 2);
    this.#_dataView.setInt16(this.#_offset, value, true);
    this.#_offset += 2;
  }

  /**
   * @description Writes an int value into the buffer.
   * @param { Number } value
   */
  putInt(value) {
    this.resizeIfNeeded(this.#_offset + 4);
    this.#_dataView.setInt32(this.#_offset, value, true);
    this.#_offset += 4;
  }

  /**
   * @description Writes a long value into the buffer.
   * @param { Number } value
   */
  putLong(value) {
    this.resizeIfNeeded(this.#_offset + 8);
    this.#_dataView.setBigInt64(this.#_offset, value, true);
    this.#_offset += 8;
  }

  /**
   * @description Writes a byte value into the buffer.
   * @param { Number } value
   */
  putByte(value) {
    this.resizeIfNeeded(this.#_offset + 1);
    this.#_dataView.setUint8(this.#_offset, value);
    this.#_offset += 1;
  }

  /**
   * @description Writes an unsigned short value into the buffer.
   * @param { Number } value
   */
  putUshort(value) {
    this.resizeIfNeeded(this.#_offset + 2);
    this.#_dataView.setUint16(this.#_offset, value, true);
    this.#_offset += 2;
  }

  /**
   * @description Writes an unsigned int value into the buffer.
   * @param { Number } value
   */
  putUint(value) {
    this.resizeIfNeeded(this.#_offset + 4);
    this.#_dataView.setUint32(this.#_offset, value, true);
    this.#_offset += 4;
  }

  /**
   * @description Writes an unsigned long value into the buffer.
   * @param { Number } value
   */
  putUlong(value) {
    this.resizeIfNeeded(this.#_offset + 8);
    this.#_dataView.setBigUint64(this.#_offset, value, true);
    this.#_offset += 8;
  }

  /**
   * @description Writes string value into the buffer.
   * @param { String } value
   * @param { Number } maxLength
   */
  putString(value, maxLength) {
    if (value.length <= 0) {
      this.putUshort(0);
      return;
    }
    if (maxLength === undefined)
      maxLength = 0;

    const charCount =
      maxLength <= 0 || value.length <= maxLength ? value.length : maxLength;
    const maxByteCount = UTF8.getMaxByteCount(charCount);
    this.resizeIfNeeded(this.#_offset + maxByteCount + 2);

    const encodedBytes = UTF8.setBytes(
      value,
      0,
      charCount,
      this.#_data,
      this.#_offset + 2
    );
    if (encodedBytes === 0) {
      this.putUshort(0);
      return;
    }

    const encodedCount = encodedBytes + 1;
    if (encodedCount > 65535 || encodedBytes < 0)
      throw new RangeError("Exceeded allowed number of encoded bytes!");
    this.putUshort(encodedCount);
    this.#_offset += encodedBytes;
  }

  /**
   * @description Writes byte values into the buffer
   * @param { Uint8Array } value
   * @param { Number } offset
   * @param { Number } length
   */

  putBytes(value, offset, length)
  {
    this.resizeIfNeeded(this.#_offset + length);
    this.#_data.set(value.slice(offset, offset + length), this.#_offset);
    this.#_offset += length;
  }
}

class NetDataReader {
  /**
   * @description Contains the raw buffer data the the reader is set to.
   * @type { Uint8Array | undefined }
   */
  get data() {
    return this.#_data;
  }
  /**
   * @description Contains the length of the buffer when set, not the raw data length.
   * @type { Number }
   */
  get length() {
    return this.#_dataSize;
  }
  /**
   * @description Contains the offset in the raw data it is reading from.
   * @type { Number }
   */
  get offset() {
    return this.#_offset;
  }
  /**
   * @description Determines whether the buffer source has not been set.
   * @type { Boolean }
   */
  get isNull() {
    return this.#_data === undefined;
  }
  /**
   * @description Determines whether the buffer has been fully read.
   * @type { Boolean }
   */
  get endOfData() {
    return this.#_offset === this.#_dataSize;
  }
  /**
   * @description Calculates how many bytes are left to read.
   * @type { Number }
   */
  get availableBytes() {
    return this.#_dataSize - this.#_offset;
  }

  /** @type { Uint8Array } */
  #_data;
  /** @type { Number } */
  #_dataSize;
  /** @type { Number } */
  #_offset = 0;
  /** @type { DataView } */
  #_dataView;

  /**
   * @description Creates a new reader.
   * @param { NetDataWriter } writer
   * @param { Uint8Array } buffer
   */
  constructor(writer = undefined, buffer = undefined) {
    if (writer !== undefined) this.setWriterSource(writer);
    else if (buffer !== undefined) this.setBufferSource(buffer);
  }

  /**
   * @description Sets the reader's source.
   * @param { NetDataWriter } writer
   */
  setWriterSource(writer) {
    this.#_data = writer.data;
    this.#_offset = 0;
    this.#_dataSize = writer.length;
    this.#_dataView = new DataView(this.#_data.buffer);
  }

  /**
   * @description Sets the reader's source.
   * @param { Uint8Array } buffer
   */
  setBufferSource(buffer) {
    this.#_data = buffer;
    this.#_offset = 0;
    this.#_dataSize = buffer.length;
    this.#_dataView = new DataView(this.#_data.buffer);
  }

  /**
   * @description Clear's the reader's source. Does not overwrite or reset the original source.
   */

  clear() {
    this.#_offset = 0;
    this.#_dataSize = 0;
    this.#_data = undefined;
  }

  /**
   * @description Get's a float value from the buffer.
   * @returns { Number }
   */
  getFloat() {
    const value = this.#_dataView.getFloat32(this.#_offset, true);
    this.#_offset += 4;
    return value;
  }

  /**
   * @description Get's a double value from the buffer.
   * @returns { Number }
   */
  getDouble() {
    const value = this.#_dataView.getFloat64(this.#_offset, true);
    this.#_offset += 8;
    return value;
  }

  /**
   * @description Get's a signed byte value from the buffer.
   * @returns { Number }
   */
  getSbyte() {
    const value = this.#_dataView.getInt8(this.#_offset);
    this.#_offset += 1;
    return value;
  }

  /**
   * @description Get's a short value from the buffer.
   * @returns { Number }
   */
  getShort() {
    const value = this.#_dataView.getInt16(this.#_offset, true);
    this.#_offset += 2;
    return value;
  }

  /**
   * @description Get's an int value from the buffer.
   * @returns { Number }
   */
  getInt() {
    const value = this.#_dataView.getInt32(this.#_offset, true);
    this.#_offset += 4;
    return value;
  }

  /**
   * @description Get's a long value from the buffer.
   * @returns { Number }
   */
  getLong() {
    const value = this.#_dataView.getBigInt64(this.#_offset, true);
    this.#_offset += 8;
    return value;
  }

  /**
   * @description Get's a byte value from the buffer.
   * @returns { Number }
   */
  getByte() {
    const value = this.#_dataView.getUint8(this.#_offset);
    this.#_offset += 1;
    return value;
  }

  /**
   * @description Get's an unsigned short value from the buffer.
   * @returns { Number }
   */
  getUshort() {
    const value = this.#_dataView.getUint16(this.#_offset, true);
    this.#_offset += 2;
    return value;
  }

  /**
   * @description Get's an unsigned int value from the buffer.
   * @returns { Number }
   */
  getUint() {
    const value = this.#_dataView.getUint32(this.#_offset, true);
    this.#_offset += 4;
    return value;
  }

  /**
   * @description Get's an unsigned long value from the buffer.
   * @returns { Number }
   */
  getUlong() {
    const value = this.#_dataView.getBigUint64(this.#_offset, true);
    this.#_offset += 8;
    return value;
  }

  /**
   * @description Get's a string value from the buffer.
   * @returns { String }
   */
  getString() {
    const num = this.getUshort();
    if (num === 0) return "";

    const count = num - 1;
    const str = UTF8.getString(this.#_data, this.#_offset, count);
    this.#_offset += count;
    return str;
  }

  /**
   * @description Get's a byte array from the buffer
   * @param { Uint8Array } destination
   * @param { Number } length
   */

  getBytes(destination, length)
  {
    destination.set(this.#_data.slice(this.#_offset, this.#_offset + length));
    this.#_offset += length;
  }
}

const McApiPacketType = Object.freeze({
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

class McApiPacket extends NetSerializable {
  /** @type { Number } */
  packetId = McApiPacketType.unknown;
}

class LoginPacket extends McApiPacket {
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

class PingPacket extends McApiPacket {
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

class LogoutPacket extends McApiPacket {
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

class AcceptPacket extends McApiPacket {
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

class DenyPacket extends McApiPacket {
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
class SetEffectPacket extends McApiPacket {
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

class AudioPacket extends McApiPacket {
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
    if(this.length > 1000)
      throw new RangeError(`Array length exceeds maximum number of bytes per packet! Got ${Length} bytes.`);
    this.data = new Uint8Array(this.length);
    reader.getBytes(this.data, this.length);
  }
}

class SetTitlePacket extends McApiPacket {
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

class SetDescriptionPacket extends McApiPacket {
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

class Packet extends McApiPacket {
  /** @type { String } */
  sessionToken;

  constructor(sessionToken) {
    super();
    this.packetId = McApiPacketType.unknown;
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

class VoiceCraft {
  static #version = Object.freeze({ major: 1, minor: 1, build: 0 });
  static get version() {
    return this.#version;
  }

  /** @type { String } */
  static #rawtextPacketId = "§p§k";
  static get rawtextPacketId() {
    return this.#rawtextPacketId;
  }

  /** @type { Boolean } */
  static #initialized = false;
  static get initialized() {
    return this.#initialized;
  }

  /** @type { VoiceCraftWorld } */
  static #world;
  static get world() {
    if (!this.#initialized)
      throw new Error(
        "Class must be initialized before use! Use the init() function to initialize the class!"
      );
    return this.#world;
  }

  /** @type { PacketEvents } */
  static #packetEvents;
  static get packetEvents() {
    if (!this.#initialized)
      throw new Error(
        "Class must be initialized before use! Use the init() function to initialize the class!"
      );
    return this.#packetEvents;
  }

  constructor() {
    throw new Error("Cannot initialize a static class!");
  }

  static init() {
    this.#world = new VoiceCraftWorld();
    this.#packetEvents = new PacketEvents();
    this.#initialized = true;
  }
}

class PacketEvents {
  /** @type { Event<McApiPacket> } */
  #unknownPacketEvent = new Event();
  get unknownPacketEvent() {
    return this.#unknownPacketEvent;
  }

  /** @type { Event<LoginPacket> } */
  #loginPacketEvent = new Event();
  get loginPacketEvent() {
    return this.#loginPacketEvent;
  }

  /** @type { Event<LogoutPacket> } */
  #logoutPacketEvent = new Event();
  get logoutPacketEvent() {
    return this.#logoutPacketEvent;
  }

  /** @type { Event<PingPacket> } */
  #pingPacketEvent = new Event();
  get pingPacketEvent() {
    return this.#pingPacketEvent;
  }

  /** @type { Event<AcceptPacket> } */
  #acceptPacketEvent = new Event();
  get acceptPacketEvent() {
    return this.#acceptPacketEvent;
  }

  /** @type { Event<DenyPacket> } */
  #denyPacketEvent = new Event();
  get denyPacketEvent() {
    return this.#denyPacketEvent;
  }

  /** @type { Event<SetEffectPacket> } */
  #setEffectPacketEvent = new Event();
  get setEffectPacketEvent() {
    return this.#setEffectPacketEvent;
  }

  /** @type { Event<AudioPacket> } */
  #audioPacketEvent = new Event();
  get audioPacketEvent() {
    return this.#audioPacketEvent;
  }

  /** @type { Event<SetTitlePacket> } */
  #setTitlePacketEvent = new Event();
  get setTitlePacketEvent() {
    return this.#setTitlePacketEvent;
  }

  /** @type { Event<SetDescriptionPacket> } */
  #setDescriptionPacketEvent = new Event();
  get setDescriptionPacketEvent() {
    return this.#setDescriptionPacketEvent;
  }
}

class Locales {
  static get LocaleKeys() {
    return this.#localeKeys;
  }

  static #localeKeys = Object.freeze({
    McApi: {
      Status: {
        Connected: "McApi.Status.Connected",
      },
      DisconnectReason: {
        None: "McApi.DisconnectReason.None",
        Timeout: "McApi.DisconnectReason.Timeout",
        InvalidLoginToken: "McApi.DisconnectReason.InvalidLoginToken",
        IncomaptibleVersion: "McApi.DisconnectReason.IncompatibleVersion",
      },
    },
  });

  /** @param { String } localeKey */
  static get(localeKey) {
    const splitKey = localeKey.split(".");

    let current = this.#localeKeys;
    for(const key of splitKey)
    {
      current = current[key];
      if(!current) return localeKey;
    }

    if (typeof current !== 'string') {
			return localeKey;
		}

    return current;
  }
}

class Z85 {
  static #Base85 = 85;

  static #EncodingTable = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    ".",
    "-",
    ":",
    "+",
    "=",
    "^",
    "!",
    "/",
    "*",
    "?",
    "&",
    "<",
    ">",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "@",
    "%",
    "$",
    "#",
  ];

  static #DecodingTable = [
    0, 68, 0, 84, 83, 82, 72, 0, 75, 76, 70, 65, 0, 63, 62, 69, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 64, 0, 73, 66, 74, 71, 81, 36, 37, 38, 39, 40, 41, 42, 43,
    44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 77,
    0, 78, 67, 0, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 79, 0, 80, 0, 0,
  ];

  /**
   * @param { Uint8Array } data
   * @returns { String }
   */
  static getStringWithPadding(data) {
    const lengthMod4 = data.length % 4;
    const paddingRequired = lengthMod4 != 0;
    let bytesToEncode = data;
    let bytesToPad = 0;
    if (paddingRequired) {
      bytesToPad = 4 - lengthMod4;
      bytesToEncode = new Uint8Array(data.length + bytesToPad);
      bytesToEncode.set(data);
    }

    let z85String = this.getString(bytesToEncode);
    if (paddingRequired) {
      z85String += bytesToPad;
    }

    return z85String;
  }

  /**
   * @param { Uint8Array } data
   * @returns { String }
   */
  static getString(data) {
    if (data.length % 4 != 0) {
      throw new RangeError("Input length must be a multiple of 4.");
    }

    const view = new DataView(data.buffer);
    let result = "";
    let value = 0;

    for (let i = 0; i < data.length; ++i) {
      value = value * 256 + view.getUint8(i);
      if ((i + 1) % 4 === 0) {
        let divisor = this.#Base85 * this.#Base85 * this.#Base85 * this.#Base85;
        for (let j = 5; j > 0; --j) {
          const code = Math.floor(value / divisor) % this.#Base85;
          result += this.#EncodingTable[code];
          divisor /= this.#Base85;
        }
        value = 0;
      }
    }
    return result;
  }

  /**
   * @param { String } data
   * @returns { Uint8Array }
   */
  static getBytesWithPadding(data) {
    var lengthMod5 = data.length % 5;
    if (lengthMod5 != 0 && (data.length - 1) % 5 != 0) {
      throw new RangeError(
        "Input length must be a multiple of 5 with either padding or no padding."
      );
    }

    let paddedBytes = 0;
    if (lengthMod5 != 0) {
      paddedBytes = Number.parseInt(data.charAt(data.length - 1));
      if (isNaN(paddedBytes) || paddedBytes < 1 || paddedBytes > 3) {
        throw new Error("Invalid padding character for a Z85 string.");
      }

      data = data.substring(0, data.length - 1);
    }

    let output = this.getBytes(data);
    //Remove padded bytes
    if (paddedBytes > 0) output = output.slice(0, output.length - paddedBytes);
    return output;
  }

  /**
   * @param { String } data
   * @returns { Uint8Array }
   */
  static getBytes(data) {
    if (data.length % 5 != 0) {
      throw new RangeError("Input length must be a multiple of 5");
    }

    const output = new Uint8Array((data.length / 5) * 4);
    const view = new DataView(output.buffer);
    let value = 0;
    let charIdx = 0;
    let byteIdx = 0;
    for (var i = 0; i < data.length; ++i) {
      const code = data.charCodeAt(charIdx++) - 32;
      value = value * this.#Base85 + this.#DecodingTable[code];
      if (charIdx % 5 === 0) {
        let divisor = 256 * 256 * 256;
        while (divisor >= 1) {
          if (byteIdx < view.byteLength) {
            view.setUint8(byteIdx++, Math.floor(value / divisor) % 256);
          }
          divisor /= 256;
        }
        value = 0;
      }
    }

    return output;
  }
}

export { AcceptPacket, AudioPacket, DenyPacket, EntityType, Event, Locales, LoginPacket, LogoutPacket, McApiPacket, McApiPacketType, NetDataReader, NetDataWriter, NetSerializable, Packet, PacketEvents, PingPacket, Quaternion, SetDescriptionPacket, SetEffectPacket, SetTitlePacket, UTF8, Vector3, VoiceCraft, VoiceCraftEntity, VoiceCraftWorld, Z85 };
