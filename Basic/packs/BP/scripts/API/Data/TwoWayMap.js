export class TwoWayMap {
    _mapKeysToValue = new Map();
    _mapValueToKeys = new Map();
    get size() {
        return this._mapKeysToValue.size;
    }
    clear() {
        this._mapKeysToValue.clear();
        this._mapValueToKeys.clear();
    }
    delete(key) {
        const value = this._mapKeysToValue.get(key);
        if (value === undefined)
            return false;
        this._mapKeysToValue.delete(key);
        this._mapValueToKeys.delete(value);
        return true;
    }
    forEach(callbackfn, thisArg) {
        this._mapKeysToValue.forEach(callbackfn, thisArg);
    }
    get(key) {
        return this._mapKeysToValue.get(key);
    }
    has(key) {
        return this._mapKeysToValue.has(key);
    }
    set(key, value) {
        this._mapKeysToValue.set(key, value);
        this._mapValueToKeys.set(value, key);
        return this;
    }
    entries() {
        return this._mapKeysToValue.entries();
    }
    keys() {
        return this._mapKeysToValue.keys();
    }
    values() {
        return this._mapKeysToValue.values();
    }
    [Symbol.iterator]() {
        return this._mapKeysToValue[Symbol.iterator]();
    }
    [Symbol.toStringTag] = "Object";
    //Values
    valueGet(value) {
        return this._mapValueToKeys.get(value);
    }
    valueHas(value) {
        return this._mapValueToKeys.has(value);
    }
    valueSet(value, key) {
        this._mapKeysToValue.set(key, value);
        this._mapValueToKeys.set(value, key);
        return this;
    }
    valueDelete(value) {
        const key = this._mapValueToKeys.get(value);
        if (key === undefined)
            return false;
        this._mapKeysToValue.delete(key);
        this._mapValueToKeys.delete(value);
        return true;
    }
}
