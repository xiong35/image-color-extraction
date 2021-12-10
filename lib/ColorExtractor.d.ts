/**
 * ## usage
 *
 * ```js
 * import { ColorExtractor } from "image-color-extraction";
 *
 * const extractor = new ColorExtractor();
 *
 * extractor
 *   .extractColor("http://blog.xiong35.cn/color-extract/3.jpg")
 *   .then(() => {
 *     console.log(extractor.colors);
 *     //  [
 *     //    {color: '#383143', count: 296014},
 *     //    {color: '#d6bca9', count: 87642},
 *     //    {color: '#a35560', count: 58061},
 *     //    {color: '#d39470', count: 18149},
 *     //    {color: '#666187', count: 13415},
 *     //    {color: '#9e6d8c', count: 12094},
 *     //  ]
 *     console.log(extractor.chooseReadableColor());
 *     //  ['#383143', '#d6bca9']
 *  });
 * ```
 *
 * more detail on [manual book](https://github.com/xiong35/image-color-extraction#manual)
 */
export declare class ColorExtractor {
    /** read the extracted colors from here */
    colors?: ColorInfo[];
    private config;
    constructor(config?: Partial<Config>);
    /**
     * reset part of the entity's config(only overide the given parts)
     * @param config part of the new config
     */
    setConfig(config: Partial<Config>): void;
    /**
     * extract color of given image url
     * @param image image url
     */
    extractColor(image: string): Promise<ColorInfo[]>;
    /**
     * extract color of given image element
     * @param image HTML image element
     */
    extractColor(image: HTMLImageElement): Promise<ColorInfo[]>;
    private _extractColor;
    private getMainColors;
    /**
     * **after** extracted colors, choose the front ground color and background color within them
     * @returns `[bgColor, frontColor]`
     */
    chooseReadableColor(): string[];
}
declare type Config = {
    /**
     * compress the given image to get faster speed\
     * a `400 * 600` image * rate of 0.5 => a `200 * 300` image\
     * the speed will be 4 times faster than before compression\
     * default to 0.03
     */
    compresionRate: number;
    /**
     * reduce the color of a image to this count\
     * (e.g. set topColorCount to 4 to extract the top 4 colors)\
     * default to 4
     */
    topColorCount: number;
};
declare type ColorInfo = {
    color: string;
    count: number;
};
export {};
