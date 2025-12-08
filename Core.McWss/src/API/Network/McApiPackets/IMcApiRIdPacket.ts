export interface IMcApiRIdPacket {
    get RequestId(): string;
}

export function IsIMcApiRIdPacket(object: any): object is IMcApiRIdPacket {
    return 'PacketType' in object;
}