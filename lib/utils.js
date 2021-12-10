"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padStart = exports.hexToRgb = exports.rgbToHex = void 0;
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex([r, g, b]) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
exports.rgbToHex = rgbToHex;
/**
 * @param hex 7 char hex string, e.g. "#ffffff"
 * @returns [r, g, b]
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result)
        throw `\`${hex}\` is not a valid hex string`;
    return result.slice(1, 4).map((r) => parseInt(r, 16));
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
    let pad = "";
    const len = targetLength - _this.length;
    let i = 0;
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
