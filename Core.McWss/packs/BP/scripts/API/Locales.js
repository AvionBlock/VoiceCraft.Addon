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
}
