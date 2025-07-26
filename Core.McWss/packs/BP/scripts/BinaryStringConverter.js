export default class BinaryStringConverter
{
    /** 
     * @param { Uint8Array } bytes
     * @param { Number } offset
     * @param { Number } length
     * @returns { String }
     */
    static encode(bytes, offset, length)
    {
        return String.fromCharCode.apply(null, bytes.slice(offset, length));
    }

    /**
     * @param { String } chars
     * @param { Number } offset
     * @param { Number } length
     * @returns { Uint8Array }
     */
    static decode(chars, offset, length)
    {
        const bytes = new Uint8Array(length - offset);
        for(let i = offset; i < length; i++)
        {
            bytes[i] = chars.charCodeAt(i);
        }
        return bytes;
    }
}