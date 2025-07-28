import { config } from "./config";
import { DataTypes } from "./DataTypes";
import { world, system } from "@minecraft/server"
import { PacketHandle, TypeHandle, listeners, sendPackets } from "./Handle";
import { Transcoder, packetIdCharset } from "./Transcoder"
import * as utils from "./utils"

const encoder = Transcoder // Named differently to en/decoder to avoid conflicts with native (or not) TextEncoder / TextDecoder interfaces
const decoder = Transcoder // but so that you could technically switch to them or another transcoder down the road

/* - Loading Cycle -
 Ensure that all addons are loaded and all listeners have been attached before sending any data */

/**
 * Queue for requests that resolves when all addons are loaded
 *  @type {(()=>void)[]}
 */
let loadingPromises = []
let loaded = false // Keeps track of when things are loaded

// Remember the last time a module has loaded
let lastModuleLoaded = system.currentTick
const id = system.afterEvents.scriptEventReceive.subscribe(event=>{
    if(event.id=="registry:loaded") return lastModuleLoaded = system.currentTick;
},{namespaces:["registry"]})

// Wait until no more modules are loaded and then resolve the queue
system.runInterval(()=>{
    if(system.currentTick - lastModuleLoaded > config.moduleLoadTimeout) {
        // Modules are considered loaded
        loaded = true;

        system.afterEvents.scriptEventReceive.unsubscribe(id)
        loadingPromises.forEach(callback=>{
            callback(true)
        })
    }
},1)

system.run(()=>utils.sendMsg("registry:loaded", "")) // Report that system has loaded
// (Loading End)

/**
 * Stack that houses all the packet registration requests
 * @type {Map<string, ((id: string)=>void)[]>}
 */
let registerQueue = new Map()
/** @type {{[packetId: string]: TypeHandle|PacketHandle}} */
let registerStack = {}
let packetId = 0;
const maxPacketId = 4294967296

// Registry
system.afterEvents.scriptEventReceive.subscribe(event=>{
    if(event.id=="registry:register") {
        if(registerQueue.has(event.message)) {
            if(packetId === maxPacketId) throw "I dont know how you did this, but you reached the maximum packet count of "+maxPacketId

            let res = "";
            let arr = new Uint8Array(4)
            let view = new DataView(arr.buffer)
            view.setUint32(0, packetId)
            
            arr.forEach(byte=>{res+=packetIdCharset.charAt(byte)});
            
            // Give each type its respective id based on the order Minecraft gave the packets out
            registerQueue.get(event.message).forEach(callback=>callback(res))
            packetId++;
        }
    }
}, {namespaces:["registry"]})
export let builtInDataTypes;
export class System {
    /**
     * Registers a Type to the system and returns an TypeHandle that can be
     * referenced and used in other types or packets
     * @param {string} name
     * @param {DataTypes[]|{[name: string]: DataTypes}} packetInfoTypes
     * @returns {Promise<TypeHandle>}
     */
    static async registerType(name, packetInfoTypes) {
        // Only register the types when all Script API scripts are wake
        await this.untilLoaded();

        // Data body containing all the necessary information for the packet type
        const data = utils.getDataStructString(name, packetInfoTypes, builtInDataTypes)

        // Send the register request
        utils.sendMsg("registry:register", data)

        // Return a new promise that resolves once the packet type has got registered globally
        let typeId = await new Promise((res, rej)=>{
            if(!registerQueue.has(data) || !registerQueue.get(data)) registerQueue.set(data, [res])
            else registerQueue.get(data).push(res)

            system.runTimeout(()=>{
                rej("Fatal error") // When the type seems to not be registered, throw an error after a certain amount of time
            }, 1000)
        })

        const handle = new TypeHandle(name, typeId, packetInfoTypes)
        registerStack[typeId] = handle
        return handle;
    }
    /**
     * Registers a Type to the system and returns an PacketConstruct that holds methods that can be used to send the packet and manage it
     * @param {string} name
     * @param {DataTypes[]|{[name: string]: DataTypes}} packetInfoTypes
     * @returns {Promise<PacketHandle>}
     */
    static async registerPacket(name, packetInfoTypes) {
        // Only register the packet when all Script API scripts are wake
        await this.untilLoaded();

        // Data body containing all the necessary information for the packet type
        const data = utils.getDataStructString(name, packetInfoTypes, builtInDataTypes)

        // Send the register request
        utils.sendMsg("registry:register", data)

        // Return a new promise that resolves once the packet type has got registered globally
        let typeId = await new Promise((res, rej)=>{
            if(!registerQueue.has(data) || !registerQueue.get(data)) registerQueue.set(data, [res])
            else registerQueue.get(data).push(res)

            system.runTimeout(()=>{
                rej("Fatal error") // When the type seems to not be registered, throw an error after a certain amount of time
            }, 1000)
        })

        const handle = new PacketHandle(name, typeId, packetInfoTypes)
        registerStack[typeId] = handle
        return handle;
    }

    /**
     * Gets any Type and returns it if its defined
     * @param {string} id Id of the type you want to get
     * @throws if the type is not registered
     */
    static getTypeSync(id) {
        let type = registerStack[id]
        if(!type) throw "Error, this type is not loaded yet but you're referencing it"

        return type;
    }
    /**
     * Gets any Type and reliably returns its Handle.
     * [Warning] If the definition of the Type is beyond this getType statement
     * and you await this, it will wait indefinetly because it waits until
     * the type is defined
     * @param {string} id The id of the Type
     * @returns {Promise<TypeHandle | PacketHandle>}
     */
    static async getType(id) {
        let type = registerStack[id]
        if(!type) {
            // Type is not loaded make a temporare request tree
            return await new Promise(res=>{
                registerStack[id] = [res]
            })
        } else if(Array.isArray(type)) {
            return await new Promise(res=>{
                registerStack[id].push(res)
            })
        } else {
            return Promise.resolve(type)
        }
    }

    /**
     * Haults the process until the protcol listeners are globally loaded across all Packs
     * @returns {Promise<boolean>}
     */
    static async untilLoaded() {
        if(loaded) {
            return Promise.resolve(true)
        } else {
            return new Promise(res=>{
                // Add the request to the queue
                loadingPromises.push(res)
            })
        }
    }

    /**
     * Haults the process if the native datatypes are not fully registered yet
     * and returns the native datatypes
     * @returns {Promise<TypeHandle[]>}
     */
    static async getNativeTypes() {
        if(!builtInDataTypes) builtInDataTypes = [
            await System.registerType('ch', []),
            await System.registerType('int8', []),
            await System.registerType('int16', []),
            await System.registerType('int32', []),
            await System.registerType('svarint', []),
            '', // this is the unsigned enum member
            await System.registerType('uint8', []),
            await System.registerType('uint16', []),
            await System.registerType('uint32', []),
            await System.registerType('varint', []),
        
            await System.registerType('float32', []),
            await System.registerType('float64', []),
            await System.registerType('bool', []),
            await System.registerType('string', []),
            await System.registerType('boolgroup', []),
            await System.registerType('array', []),
            await System.registerType('bytearray', []),
        ];
        return builtInDataTypes;
    }
}

await System.getNativeTypes(); // Registers the native types and keeps any external module from using native types before they are registered

/** @type {{[requestId: string]: string[]}} */
let multiRequestPackets = {}
system.afterEvents.scriptEventReceive.subscribe(async (event)=>{
    const packetHeader = event.id.replace("packet:","")
    const [packetId, requestId, orderId] = packetHeader.split("-")
    
    if(sendPackets[requestId+(orderId??'')]) return sendPackets[requestId+(orderId??'')](true); // Check if the packet has been send by this addon (the callback is relevant in the future as I want to implement it resending the data incase it got dismissed for some reason, and running that callback tells the code that it got send)
    if(!listeners[packetId]) return; // return if there are no listeners registered for this packet

    let payload = '';

    // Check if payload is split into multiple payloads
    if(orderId && orderId != '') {
        let orderNumber = decoder.decodeId(orderId);
        
        // Add the payload to the stack
        const stack = multiRequestPackets[requestId];
        if(stack) stack[orderNumber] = event.message.substring(1, event.message.length-1)
        else { multiRequestPackets[requestId] = [ orderNumber ]; return }

        // Get the stack of all the payload pieces
        const len = stack.length

        // Check if all the payload pieces have been collected
        for (let i = 0; i < len; i++) if(!stack[i]) return; // Because the orderId is descending when we loop we first check the elements that are added last so we dont waste time on looping over huge stacks

        // Concatenate all the payload pieces
        for (let i = len - 1; i > 0; i--) {
            payload += stack[i];
        }
    } else {
        payload = event.message.substring(1, event.message.length-1) // Get everything between the ""
    }

    let packetHandle = await System.getType(packetId);

    // Decode the data from the string to all their respective data types
    let uint8arr = decoder.decode(payload);
    let output = packetHandle.decode(uint8arr).decodedParameters;

    listeners[packetId].forEach(listener=>{
        listener(output)
    })
}, {namespaces: ["packet"]})

// This registers the native types through the same api so that they always get a unique id. Ensures that types dont break across versions
export default builtInDataTypes;