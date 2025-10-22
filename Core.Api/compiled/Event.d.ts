export declare class Event<T> {
    private _listeners;
    /**
     * @description Subscribes to the event.
     */
    Subscribe(callback: (data: T) => void): void;
    /**
     * @description Unsubscribes a specific callback instance from the event.
     */
    Unsubscribe(callback: (data: T) => void): void;
    /**
     * @description Triggers the event and calls all listeners.
     */
    Invoke(data: T): void;
}
