import { McApiMcwss } from "../McApiMcwss";
import "../Extensions";
export declare class CommandManager {
    private _mcapi;
    constructor(_mcapi: McApiMcwss);
    private RegisterCommands;
    private ConnectCommand;
    private SendCommandTunnel;
    private ReceiveCommandTunnel;
}
