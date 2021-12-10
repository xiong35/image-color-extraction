"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseReadableColor = void 0;
const utils_1 = require("./utils");
/**
 *
 * @param color 7 char hex string, e.g. "#ffffff"
 * @returns
 */
function getLuminance(color) {
    const [r, g, b] = (0, utils_1.hexToRgb)(color);
    const RsRGB = r / 255;
    const GsRGB = g / 255;
    const BsRGB = b / 255;
    let R, G, B;
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
    const backLum = getLuminance(back) + 0.005;
    const frontLum = getLuminance(front) + 0.005;
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
    const [bgc, ...rest] = colors.slice(0, 8);
    const contrastData = [];
    for (let index = 0; index < rest.length; index++) {
        const front = rest[index];
        const contrast = getContrast(bgc, front);
        contrastData.push({
            contrast,
            front,
            index,
        });
    }
    // choose the highest scored color
    contrastData.sort((a, b) => getScore(b) - getScore(a));
    const frontData = contrastData[0];
    return [bgc, frontData.front];
}
exports.chooseReadableColor = chooseReadableColor;
