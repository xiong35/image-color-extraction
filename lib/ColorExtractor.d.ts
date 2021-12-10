export declare class ColorExtractor {
    colors?: ColorInfo[];
    private config;
    constructor(config?: Partial<Config>);
    /**
     * reset part of the entity's config(only change the given parts)
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
