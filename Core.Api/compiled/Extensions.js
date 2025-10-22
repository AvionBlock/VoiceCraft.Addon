"use strict";
String.prototype.isEmptyOrWhiteSpace = function () {
    return this.length === 0 || !this.trim();
};
