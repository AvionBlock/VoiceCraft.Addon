export class Vector2 {
    constructor(x = 0, y = 0) {
        this.X = x;
        this.Y = y;
    }
    X;
    Y;
    Equals(value) {
        if (value.X !== this.X || value.Y !== this.Y)
            return false;
        return true;
    }
}
