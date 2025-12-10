export class TwoWayMap<K, V> implements Map<K, V> {
  private readonly _mapKeysToValue: Map<K, V> = new Map();
  private readonly _mapValueToKeys: Map<V, K> = new Map();

  get size(): number {
    return this._mapKeysToValue.size;
  }

  public clear(): void {
    this._mapKeysToValue.clear();
    this._mapValueToKeys.clear();
  }

  public delete(key: K): boolean {
    const value = this._mapKeysToValue.get(key);
    if (value === undefined) return false;
    this._mapKeysToValue.delete(key);
    this._mapValueToKeys.delete(value);
    return true;
  }

  public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    this._mapKeysToValue.forEach(callbackfn, thisArg);
  }

  public get(key: K): V | undefined {
    return this._mapKeysToValue.get(key);
  }

  public has(key: K): boolean {
    return this._mapKeysToValue.has(key);
  }

  public set(key: K, value: V): this {
    this._mapKeysToValue.set(key, value);
    this._mapValueToKeys.set(value, key);
    return this;
  }

  public entries(): MapIterator<[K, V]> {
    return this._mapKeysToValue.entries();
  }

  public keys(): MapIterator<K> {
    return this._mapKeysToValue.keys();
  }

  public values(): MapIterator<V> {
    return this._mapKeysToValue.values();
  }

  public [Symbol.iterator](): MapIterator<[K, V]> {
    return this._mapKeysToValue[Symbol.iterator]();
  }
  public [Symbol.toStringTag]: string = "Object";

  //Values
  public valueGet(value: V): K | undefined {
    return this._mapValueToKeys.get(value);
  }
  
  public valueHas(value: V): boolean {
    return this._mapValueToKeys.has(value);
  }

  public valueSet(value: V, key: K): this {
    this._mapKeysToValue.set(key, value);
    this._mapValueToKeys.set(value, key);
    return this;
  }

  public valueDelete(value: V): boolean {
    const key = this._mapValueToKeys.get(value);
    if (key === undefined) return false;
    this._mapKeysToValue.delete(key);
    this._mapValueToKeys.delete(value);
    return true;
  }
}
