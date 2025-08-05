export class Locales {
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
