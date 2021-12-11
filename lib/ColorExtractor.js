"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorExtractor = void 0;
const readableColor_1 = require("./readableColor");
const octree_1 = require("./octree");
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
class ColorExtractor {
    constructor(config) {
        this.config = defaultConfig;
        if (config)
            this.setConfig(config);
    }
    /**
     * reset part of the entity's config(only overide the given parts)
     * @param config part of the new config
     */
    setConfig(config) {
        if (!config)
            throw "config must not be empty";
        if (config.compresionRate !== undefined && config.compresionRate < 0)
            throw "compresion rate must not be negative";
        if (config.timeout !== undefined && typeof config.timeout !== "number")
            throw "timeout must be number";
        Object.keys(config).forEach((k) => {
            const newVal = config[k];
            if (newVal === undefined)
                return;
            this.config[k] = newVal;
        });
    }
    extractColor(image) {
        return __awaiter(this, void 0, void 0, function* () {
            let imageEl;
            if (typeof image === "string") {
                imageEl = document.createElement("img");
            }
            else {
                imageEl = image;
            }
            // fix canvas cors problem
            imageEl.crossOrigin = "Anonymous";
            yield new Promise((res) => {
                imageEl.onload = () => {
                    res();
                };
                if (this.config.timeout >= 0) {
                    setTimeout(res, this.config.timeout);
                }
                if (typeof image === "string")
                    imageEl.src = image;
            });
            this._extractColor(imageEl);
            return this.colors;
        });
    }
    _extractColor(image) {
        let { width, height } = image;
        width *= this.config.compresionRate;
        height *= this.config.compresionRate;
        const canvasEl = document.createElement("canvas");
        canvasEl.width = width;
        canvasEl.height = height;
        const ctx = canvasEl.getContext("2d");
        if (!ctx)
            throw "cannot get canvas context";
        ctx.drawImage(image, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;
        const colors = this.getMainColors(imgData);
        this.colors = colors;
    }
    getMainColors(data) {
        const root = new octree_1.Node();
        octree_1.Node.toReduce = new Array(8).fill(0).map(() => []);
        octree_1.Node.leafNum = 0;
        for (let i = 0; i < data.length; i += 4) {
            root.addColor([data[i], data[i + 1], data[i + 2]], 0);
            while (octree_1.Node.leafNum > this.config.topColorCount * 2)
                (0, octree_1.reduceTree)();
        }
        const record = {};
        (0, octree_1.colorsStats)(root, record);
        const result = [];
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
        return (0, readableColor_1.chooseReadableColor)(this.colors.map((c) => c.color));
    }
}
exports.ColorExtractor = ColorExtractor;
const defaultConfig = {
    compresionRate: 0.2,
    topColorCount: 6,
    timeout: 1000 * 10,
};
