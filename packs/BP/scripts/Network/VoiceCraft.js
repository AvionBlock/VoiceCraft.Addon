import { Player } from "@minecraft/server";

class VoiceCraft {
    /**
     * @description Attempts to connect to a VoiceCraft server through MCWSS
     * @param { Player } source
     * @param { String } ip
     * @param { Number } port
     */
    static ConnectAsync(source, ip, port, loginToken)
    {
        source.sendMessage()
    }
}

export { VoiceCraft }