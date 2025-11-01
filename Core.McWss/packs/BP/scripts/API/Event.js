export class Event {
    _listeners = [];
    /**
     * @description Subscribes to the event.
     */
    Subscribe(callback) {
        this._listeners.push(callback);
        return callback;
    }
    /**
     * @description Unsubscribes a specific callback instance from the event.
     */
    Unsubscribe(callback) {
        const index = this._listeners.findIndex((x) => x === callback);
        if (index < 0)
            return;
        this._listeners = this._listeners.splice(index, 1);
    }
    /**
     * @description Triggers the event and calls all listeners.
     */
    Invoke(data) {
        for (let callback of this._listeners) {
            try {
                callback(data);
            }
            catch {
                //Do Nothing
            }
        }
    }
}
