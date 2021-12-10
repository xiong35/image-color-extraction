# Image Color Extraction

extract the most frequently occurred colors of a given image with canvas

**try [online demo here](http://www.xiong35.cn/color-extraction)**

[中文文档](./README.md)

## What's Special

- use octree🎄 algrithem to get better performance and faster speed!🚀
- written in pure ts🤸‍♂️
- detailed comments and docs📜
- export helper functions to deal with colors🛠
- configurable🔧

## Install

```bash
yarn add image-color-extraction
# Or
npm i image-color-extraction
```

## Quick Start

```js
import { ColorExtractor } from "image-color-extraction";

const extractor = new ColorExtractor();

extractor
  // try 1.jpg, 2.jpg and 4.jpg😏
  .extractColor("http://blog.xiong35.cn/color-extract/3.jpg")
  .then(() => {
    console.log(extractor.colors);
    /* 
      [
        {color: '#383143', count: 296014},
        {color: '#d6bca9', count: 87642},
        {color: '#a35560', count: 58061},
        {color: '#d39470', count: 18149},
        {color: '#666187', count: 13415},
        {color: '#9e6d8c', count: 12094},
      ]
    */
    console.log(extractor.chooseReadableColor());
    /* 
      ['#383143', '#d6bca9']
     */
  });
```

## Manual

main class `ColorExtractor`:

```ts
const defaultConfig: Config = {
  compresionRate: 0.2,
  topColorCount: 6,
};

declare type Config = {
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
};

export declare class ColorExtractor {
  /** read the extracted colors from here */
  colors?: ColorInfo[];
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

  /**
   * **after** extracted colors, choose the front ground color and background color within them
   * @returns `[bgColor, frontColor]`
   */
  chooseReadableColor(): string[];
}
declare type ColorInfo = {
  color: string;
  count: number;
};
```

helper functions:

```ts
export declare function rgbToHex([r, g, b]: PixelData): string;

/**
 * @param hex 7 char hex string, e.g. "#ffffff"
 * @returns [r, g, b]
 */
export declare function hexToRgb(hex: string): number[];
```

exports:

```ts
export { ColorExtractor } from "./ColorExtractor";
export { hexToRgb, rgbToHex } from "./utils";
```

---

happy hacking!
