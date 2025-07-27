export default class Vector3 {
    /** 
     * @param { Number } x 
     * @param { Number } y 
     * @param { Number } z 
     */
    constructor(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /** @type { Number } */
    x;
    /** @type { Number } */
    y;
    /** @type { Number } */
    z;
}