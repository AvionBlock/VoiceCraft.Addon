export default class Locales {
  /** @type { Map<String, String> } */
  static #localeKeys = new Map([
    ["McApi.Status.Connected", "McApi.Status.Connected"],
    ["McApi.DisconnectReason.None", "McApi.DisconnectReason.None"],
    ["McApi.DisconnectReason.Timeout", "McApi.DisconnectReason.Timeout"],
    [
      "McApi.DisconnectReason.InvalidLoginToken",
      "McApi.DisconnectReason.InvalidLoginToken",
    ],
    [
      "McApi.DisconnectReason.IncompatibleVersion",
      "McApi.DisconnectReason.IncompatibleVersion",
    ],
  ]);
  
  constructor()
  {
    throw new Error("Cannot initialize a static class!");
  }


  /**
   * @param { String } key
   * @returns { String }
   */
  static get(key)
  {
    return this.#localeKeys.get(key);
  }

  /**
   * @param { String } key
   * @param { String } value
   */
  static set(key, value)
  {
    if(!this.#localeKeys.has(key)) return;
    this.#localeKeys.set(key, value);
  }
}
