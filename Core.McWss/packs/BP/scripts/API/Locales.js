export class Locales {
    static VcMcApi = Object.freeze({
        Status: {
            Connected: "VcMcApi.Status.Connected",
            Connecting: "VcMcApi.Status.Connecting",
            Disconnected: "VcMcApi.Status.Disconnected"
        },
        DisconnectReason: {
            None: "VcMcApi.DisconnectReason.None",
            Timeout: "VcMcApi.DisconnectReason.Timeout",
            InvalidLoginToken: "VcMcApi.DisconnectReason.InvalidLoginToken",
            IncompatibleVersion: "VcMcApi.DisconnectReason.IncompatibleVersion",
        },
    });
}
