# 图像主色提取

利用 canvas 提取给定图片的主要颜色

**[在线演示地址](http://www.xiong35.cn/color-extraction/)**

[README (English edition)](https://github.com/xiong35/image-color-extraction/blob/main/README.en.md)

## 牛逼的地方

- 用八叉树算法提取主色 🎄, 更快更强! 🚀
- 纯 ts 编写 🤸‍♂️
- 有详细的注释和文档 📜
- 暴露出处理颜色的实用函数 🛠
- 可自定义程度高 🔧

## 安装

```bash
yarn add image-color-extraction
# 或者
npm i image-color-extraction
```

## 快速上手

```js
import { ColorExtractor } from "image-color-extraction";

const extractor = new ColorExtractor();

extractor
  // 可以改成 1.jpg, 2.jpg and 4.jpg 试试😏
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

## 在项目中使用

见 [xiong35/image-color-extraction-demo](https://github.com/xiong35/image-color-extraction-demo)

## Manual

主类: `ColorExtractor`:

```ts
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

工具函数:

```ts
export declare function rgbToHex([r, g, b]: PixelData): string;

/**
 * @param hex 7 char hex string, e.g. "#ffffff"
 * @returns [r, g, b]
 */
export declare function hexToRgb(hex: string): number[];
```

导出声明:

```ts
export { ColorExtractor } from "./ColorExtractor";
export { hexToRgb, rgbToHex } from "./utils";
```

---

happy hacking!
