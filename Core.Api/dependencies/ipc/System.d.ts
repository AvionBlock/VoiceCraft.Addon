import { DataTypes } from "./DataTypes";
import { TypeHandle, PacketHandle } from "./Handle";

export class System {
    /**
     * Registers a Type to the system and returns an TypeHandle that can be referenced
     * and used in other types or packets
     * @param name Name of the type to register
     * @param packetInfoTypes Datatypes this type is made of. Can also be custom types
     * @returns 
     */
    static async registerType(name: string, packetInfoTypes: DataTypes[]): Promise<TypeHandle>;
    static async registerType(name: string, packetInfoTypes: {[name: string]: DataTypes}): Promise<TypeHandle>;

    /**
     * Registers a Type to the system and returns an PacketConstruct that holds methods
     * that can be used to send the packet and manage it
     * @param name Name of the Packet, globally used to identify this packet
     * @param packetInfoTypes Datatypes that make up this packet. Can either be an array or an object
     * @returns 
     */
    static async registerPacket(name: string, packetInfoTypes: DataTypes[]): Promise<PacketHandle>;
    static async registerPacket(name: string, packetInfoTypes: {[name: string]: DataTypes}): Promise<PacketHandle>;

    /**
     * Gets any Type and returns it if its defined
     * @param id Id of the type you want to get
     * @throws if the type is not registered
     */
    static getTypeSync(id: string): TypeHandle | PacketHandle
    /**
     * Gets any Type and reliably returns its Handle.
     * [ Warning] If the definition of the Type is beyond this getType statement
     * and you await this, it will wait indefinetly because it waits until
     * the type is defined
     * @param id The id of the Type
     */
    static async getType(id: string): TypeHandle | PacketHandle

    /**
     * Haults the process until the protcol listeners are globally loaded across all Packs
     * @returns
     */
    static async untilLoaded(): Promise<boolean>
}

/**
 * Native types
 */
export let builtInDataTypes: TypeHandle[]