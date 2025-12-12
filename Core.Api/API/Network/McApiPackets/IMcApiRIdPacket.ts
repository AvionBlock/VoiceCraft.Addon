export interface IMcApiRIdPacket {
    get RequestId(): string;
}

export function IsIMcApiRIdPacket(object: any): object is IMcApiRIdPacket {
    return 'RequestId' in object;
}