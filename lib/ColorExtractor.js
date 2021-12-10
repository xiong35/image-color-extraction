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
class ColorExtractor {
    constructor(config) {
        this.config = defaultConfig;
        if (config)
            this.setConfig(config);
        this.canvasEl = document.createElement("canvas");
    }
    /**
     * reset part of the entity's config(only change the given parts)
     * @param config part of the new config
     */
    setConfig(config) {
        if (!config)
            throw "config must not be empty";
        if (config.compresionRate !== undefined && config.compresionRate < 0)
            throw "compresion rate must not be negative";
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
                imageEl.src = image;
            }
            else {
                imageEl = image;
            }
            yield new Promise((res) => {
                imageEl.addEventListener("load", res);
            });
            this._extractColor(imageEl);
            return this.colors;
        });
    }
    _extractColor(image) {
        let { width, height } = image;
        width *= this.config.compresionRate;
        height *= this.config.compresionRate;
        // fix canvas cors problem
        image.crossOrigin = "Anonymous";
        this.canvasEl.width = width;
        this.canvasEl.height = height;
        const ctx = this.canvasEl.getContext("2d");
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
    topColorCount: 4,
};
