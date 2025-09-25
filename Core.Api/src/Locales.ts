export class Locales {
  public static get LocaleKeys() {
    return this._localeKeys;
  }

  private static _localeKeys = Object.freeze({
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

  /** @param { String } key */
  static Get(key: string) {
    const splitKey = key.split(".");

    let current: any = this._localeKeys; //Any is stupid.
    for (const key of splitKey) {
      current = current[key];
      if (!current) return key;
    }

    if (typeof current !== "string") {
      return key;
    }

    return current;
  }
}
