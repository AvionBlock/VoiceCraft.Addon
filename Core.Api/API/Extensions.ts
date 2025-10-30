String.prototype.isEmptyOrWhiteSpace = function(this: string): boolean {
    return this.length === 0 || !this.trim();
}

declare interface String {
    isEmptyOrWhiteSpace(): boolean;
}