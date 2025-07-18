import { NetDataWriter } from "./network/NetDataWriter";
import { NetDataReader } from "./network/NetDataReader";

const writer = new NetDataWriter();
const value = 0.235896286;
const value2 = 0.23246623896286;
console.warn(`Input: ${value}`);
console.warn(`Input: ${value2}`);
writer.putDouble(value);
writer.putDouble(value2);
const reader = new NetDataReader(writer);
console.warn(`Output: ${reader.getDouble()}, Output 2: ${reader.getDouble()}`);