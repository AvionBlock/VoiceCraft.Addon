export class Locales {
  public static VcMcApi = Object.freeze({
    Status: {
      Broadcast: {
        Connected: "VcMcApi.Status.Broadcast.Connected",
        Disconnected: "VcMcApi.Status.Broadcast.Disconnected",
        PlayerConnected: "VcMcApi.Status.Broadcast.PlayerConnected",
        PlayerDisconnected: "VcMcApi.Status.Broadcast.PlayerDisconnected"
      },
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
