export declare type PixelData = [number, number, number];
export declare function rgbToHex([r, g, b]: PixelData): string;
/**
 * @param hex 7 char hex string, e.g. "#ffffff"
 * @returns [r, g, b]
 */
export declare function hexToRgb(hex: string): number[];
/**
 * polyfill for es7 padStart
 * @param toPad `this`
 * @returns padded string
 */
export declare function padStart(_this: string, targetLength: number, padString: string): string;
