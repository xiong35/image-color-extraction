export type PixelData = [number, number, number];

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex([r, g, b]: PixelData) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * @param hex 7 char hex string, e.g. "#ffffff"
 * @returns [r, g, b]
 */
export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
  return result.slice(1, 4).map((r) => parseInt(r, 16));
}

/**
 * polyfill for es7 padStart
 * @param toPad `this`
 * @returns padded string
 */
export function padStart(
  _this: string,
  targetLength: number,
  padString: string
) {
  targetLength = Math.floor(targetLength) || 0;
  if (targetLength < _this.length) return String(_this);

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
