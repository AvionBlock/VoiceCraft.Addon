export class Locales {
    static VcMcApi = Object.freeze({
        Status: {
            Connected: "VcMcApi.Status.Connected",
            Connecting: "VcMcApi.Status.Connecting",
            Disconnected: "VcMcApi.Status.Disconnected"
        },
        DisconnectReason: {
            Manual: "VcMcApi.DisconnectReason.Manual",
            Timeout: "VcMcApi.DisconnectReason.Timeout",
            InvalidLoginToken: "VcMcApi.DisconnectReason.InvalidLoginToken",
            IncompatibleVersion: "VcMcApi.DisconnectReason.IncompatibleVersion",
            Shutdown: "VcMcApi.DisconnectReason.Shutdown",
            Error: "VcMcApi.DisconnectReason.Error",
        },
    });
}
