declare module "@minecraft/server" {
    interface Player {
        translateMessage(message: string, with_message?: RawMessage | string[]): void;
    }
}
export {};
