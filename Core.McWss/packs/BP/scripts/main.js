import { NetDataWriter } from "./network/NetDataWriter";
import { NetDataReader } from "./network/NetDataReader";
import UTF8 from "./utf8";

const str = "⌨⌨⌨aa⌨";
console.warn(str);
const bytes = UTF8.getBytes(str);
const string = UTF8.getString(bytes, 0, bytes.byteLength);
console.warn(string);

/*
const writer = new NetDataWriter();
const value = 0.235896286;
const value2 = 0.23246623896286;
const value3 = "23saoignag";
console.warn(`Input: ${value}`);
console.warn(`Input: ${value2}`);
console.warn(`Input: ${value3}`);
writer.putDouble(value);
writer.putDouble(value2);
writer.putString(value3);
const reader = new NetDataReader(writer);
console.warn(`Output: ${reader.getDouble()}, Output 2: ${reader.getDouble()}, Output 3: ${reader.getString()}`);
*/