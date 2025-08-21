export class Locales {
  static get LocaleKeys() {
    return this.#localeKeys;
  }

  static #localeKeys = Object.freeze({
    VcMcApi: {
      Status: {
        Connected: "VcMcApi.Status.Connected",
        Connecting: "VcMcApi.Status.Connecting",
      },
      DisconnectReason: {
        None: "VcMcApi.DisconnectReason.None",
        Timeout: "VcMcApi.DisconnectReason.Timeout",
        InvalidLoginToken: "VcMcApi.DisconnectReason.InvalidLoginToken",
        IncomaptibleVersion: "VcMcApi.DisconnectReason.IncompatibleVersion",
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
