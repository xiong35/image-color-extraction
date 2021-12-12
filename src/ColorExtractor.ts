import { chooseReadableColor } from "./readableColor";
import { colorsStats, Node, reduceTree } from "./octree";

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
 * more detail on [manual book](https://github.com/xiong35/image-color-extraction#manual)\
 *
 * [source code here](https://github.com/xiong35/image-color-extraction/blob/main/src/ColorExtractor.ts)
 */
export class ColorExtractor {
  /** read the extracted colors from here */
  colors?: ColorInfo[];
  private config: Config = defaultConfig;

  constructor(config?: Partial<Config>) {
    if (config) this.setConfig(config);
  }

  /**
   * reset part of the entity's config(only overide the given parts)
   * @param config part of the new config
   */
  setConfig(config: Partial<Config>) {
    if (!config) throw "config must not be empty";
    if (config.compresionRate !== undefined && config.compresionRate < 0)
      throw "compresion rate must not be negative";
    if (config.timeout !== undefined && typeof config.timeout !== "number")
      throw "timeout must be number";

    (Object.keys(config) as (keyof Config)[]).forEach((k) => {
      const newVal = config[k];
      if (newVal === undefined) return;
      this.config[k] = newVal;
    });
  }

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

  async extractColor(
    image: string | HTMLImageElement
  ): Promise<ColorInfo[] | undefined> {
    let imageEl: HTMLImageElement;
    if (typeof image === "string") {
      imageEl = document.createElement("img");
    } else {
      imageEl = image;
    }
    // fix canvas cors problem
    imageEl.crossOrigin = "Anonymous";

    await new Promise<void>((res) => {
      imageEl.onload = () => {
        res();
      };
      if (this.config.timeout >= 0) {
        setTimeout(res, this.config.timeout);
      }
      if (typeof image === "string") imageEl.src = image;
    });

    this._extractColor(imageEl);

    return this.colors;
  }

  private _extractColor(image: HTMLImageElement) {
    let { width, height } = image;

    width *= this.config.compresionRate;
    height *= this.config.compresionRate;

    const canvasEl = document.createElement("canvas");
    canvasEl.width = width;
    canvasEl.height = height;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) throw "cannot get canvas context";
    ctx.drawImage(image, 0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height).data;

    const colors = this.getMainColors(imgData);

    this.colors = colors;
  }

  private getMainColors(data: Uint8ClampedArray): ColorInfo[] {
    const root = new Node();

    Node.toReduce = new Array(8).fill(0).map(() => []);
    Node.leafNum = 0;

    for (let i = 0; i < data.length; i += 4) {
      root.addColor([data[i], data[i + 1], data[i + 2]], 0);

      while (Node.leafNum > this.config.topColorCount * 2) reduceTree();
    }

    const record: { [K in string]: number } = {};
    colorsStats(root, record);

    const result: ColorInfo[] = [];

    for (const k in record) {
      result.push({ color: k, count: record[k] });
    }

    result.sort((a, b) => b.count - a.count);

    return result.slice(0, this.config.topColorCount);
  }

  /**
   * **after** extracted colors, choose the front ground color and background color within them
   * @returns `[bgColor, frontColor]`
   */
  chooseReadableColor() {
    if (!this.colors)
      throw "you haven't extracted colors, please call `extractColor` first";

    if (this.colors.length < 2)
      throw "cannot generete two colors because there is only one color in this image";
    return chooseReadableColor(this.colors.map((c) => c.color));
  }
}

type Config = {
  /**
   * compress the given image to get faster speed\
   * a `400 * 600` image * rate of 0.5 => a `200 * 300` image\
   * the speed will be 4 times faster than before compression\
   * default to 0.2
   */
  compresionRate: number;
  /**
   * reduce the color of a image to this count\
   * (e.g. set topColorCount to 4 to extract the top 4 colors)\
   * default to 6
   */
  topColorCount: number;
  /**
   * set the max time for a image to load\
   * if a image is not loaded after this time the extraction will fail and the pixels will all be #000000\
   * set to non-positive value to disable timeout\
   * default to `1000 * 10`
   */
  timeout: number;
};

const defaultConfig: Config = {
  compresionRate: 0.2,
  topColorCount: 6,
  timeout: 1000 * 10,
};

type ColorInfo = {
  color: string;
  count: number;
};
