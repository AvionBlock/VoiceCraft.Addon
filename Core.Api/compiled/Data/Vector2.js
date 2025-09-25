export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    x;
    y;
    Equals(value) {
        if (value.x !== this.x || value.y !== this.y)
            return false;
        return true;
    }
}
