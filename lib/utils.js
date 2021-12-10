"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padStart = exports.hexToRgb = exports.rgbToHex = void 0;
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(_a) {
    var r = _a[0], g = _a[1], b = _a[2];
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
exports.rgbToHex = rgbToHex;
/**
 * @param hex 7 char hex string, e.g. "#ffffff"
 * @returns [r, g, b]
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result.slice(1, 4).map(function (r) { return parseInt(r, 16); });
}
exports.hexToRgb = hexToRgb;
/**
 * polyfill for es7 padStart
 * @param toPad `this`
 * @returns padded string
 */
function padStart(_this, targetLength, padString) {
    targetLength = Math.floor(targetLength) || 0;
    if (targetLength < _this.length)
        return String(_this);
    padString = padString ? String(padString) : " ";
    var pad = "";
    var len = targetLength - _this.length;
    var i = 0;
    while (pad.length < len) {
        if (!padString[i]) {
            i = 0;
        }
        pad += padString[i];
        i++;
    }
    return pad + String(_this).slice(0);
}
exports.padStart = padStart;
