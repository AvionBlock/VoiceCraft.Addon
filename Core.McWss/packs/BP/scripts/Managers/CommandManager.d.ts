import { McApiMcwss } from "../McApiMcwss";
import "../Extensions";
export declare class CommandManager {
    private _mcapi;
    private static readonly Namespace;
    constructor(_mcapi: McApiMcwss);
    private RegisterCommands;
    private ConnectCommand;
    private DataTunnelCommand;
}
