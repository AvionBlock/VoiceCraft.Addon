export var McApiPacketType;
(function (McApiPacketType) {
    McApiPacketType[McApiPacketType["Unknown"] = 0] = "Unknown";
    McApiPacketType[McApiPacketType["Login"] = 1] = "Login";
    McApiPacketType[McApiPacketType["Logout"] = 2] = "Logout";
    McApiPacketType[McApiPacketType["Ping"] = 3] = "Ping";
    McApiPacketType[McApiPacketType["Accept"] = 4] = "Accept";
    McApiPacketType[McApiPacketType["Deny"] = 5] = "Deny";
})(McApiPacketType || (McApiPacketType = {}));
