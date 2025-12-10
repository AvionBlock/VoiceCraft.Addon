export declare class TwoWayMap<K, V> implements Map<K, V> {
    private readonly _mapKeysToValue;
    private readonly _mapValueToKeys;
    get size(): number;
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    entries(): MapIterator<[K, V]>;
    keys(): MapIterator<K>;
    values(): MapIterator<V>;
    [Symbol.iterator](): MapIterator<[K, V]>;
    [Symbol.toStringTag]: string;
    valueGet(value: V): K | undefined;
    valueHas(value: V): boolean;
    valueSet(value: V, key: K): this;
    valueDelete(value: V): boolean;
}
