export class Event {
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
