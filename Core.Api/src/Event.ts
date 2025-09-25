export class Event<T> {
  private _listeners: ((data: T) => void)[] = [];

  /**
   * @description Subscribes to the event.
   */
  public Subscribe(callback: (data: T) => void) {
    this._listeners.push(callback);
  }

  /**
   * @description Unsubscribes a specific callback instance from the event.
   */
  public Unsubscribe(callback: (data: T) => void) {
    const index = this._listeners.findIndex((x) => x === callback);
    if (index < 0) return;
    this._listeners = this._listeners.splice(index, 1);
  }

  /**
   * @description Triggers the event and calls all listeners.
   */
  public Invoke(data: T) {
    for (let callback of this._listeners) {
      try {
        callback(data);
      } catch {
        //Do Nothing
      }
    }
  }
}
