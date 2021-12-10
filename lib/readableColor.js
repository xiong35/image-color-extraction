"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseReadableColor = void 0;
var utils_1 = require("./utils");
/**
 *
 * @param color 7 char hex string, e.g. "#ffffff"
 * @returns
 */
function getLuminance(color) {
    var _a = (0, utils_1.hexToRgb)(color), r = _a[0], g = _a[1], b = _a[2];
    var RsRGB = r / 255;
    var GsRGB = g / 255;
    var BsRGB = b / 255;
    var R, G, B;
    if (RsRGB <= 0.03928) {
        R = RsRGB / 12.92;
    }
    else {
        R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    }
    if (GsRGB <= 0.03928) {
        G = GsRGB / 12.92;
    }
    else {
        G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    }
    if (BsRGB <= 0.03928) {
        B = BsRGB / 12.92;
    }
    else {
        B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
/**
 * get contrast between background color and frontground color
 * @param back background color
 * @param front frontground color
 * @returns contrast
 *
 * level   |	noemal text | long text
 * ------- | ------------ | --------
 * AA      |	4.5:1	      | 3:1
 * AAA     |	7:1         | 4.5:1
 */
function getContrast(back, front) {
    var backLum = getLuminance(back) + 0.005;
    var frontLum = getLuminance(front) + 0.005;
    return Math.max(backLum, frontLum) / Math.min(backLum, frontLum);
}
/**
 * compute the score of given front ground color\
 * with its index and contrast value
 */
function getScore(d) {
    return d.contrast * d.contrast * 4 - d.index * d.index;
}
/**
 * choose a front ground color from the given colors
 * @param colors color hex that ordered by its count(ascend)
 * @returns `[bgColor, frontColor]`
 */
function chooseReadableColor(colors) {
    // get background color and front ground colors to be choose
    var _a = colors.slice(0, 8), bgc = _a[0], rest = _a.slice(1);
    var contrastData = [];
    for (var index = 0; index < rest.length; index++) {
        var front = rest[index];
        var contrast = getContrast(bgc, front);
        contrastData.push({
            contrast: contrast,
            front: front,
            index: index,
        });
    }
    // choose the highest scored color
    contrastData.sort(function (a, b) { return getScore(b) - getScore(a); });
    var frontData = contrastData[0];
    return [bgc, frontData.front];
}
exports.chooseReadableColor = chooseReadableColor;
