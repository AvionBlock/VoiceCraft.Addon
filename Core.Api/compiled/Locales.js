export class Locales {
    static get LocaleKeys() {
        return this._localeKeys;
    }
    static _localeKeys = Object.freeze({
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
    static Get(key) {
        const splitKey = key.split(".");
        let current = this._localeKeys; //Any is stupid.
        for (const key of splitKey) {
            current = current[key];
            if (!current)
                return key;
        }
        if (typeof current !== "string") {
            return key;
        }
        return current;
    }
}
