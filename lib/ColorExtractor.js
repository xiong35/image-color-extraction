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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorExtractor = void 0;
var readableColor_1 = require("./readableColor");
var octree_1 = require("./octree");
var ColorExtractor = /** @class */ (function () {
    function ColorExtractor(config) {
        this.config = defaultConfig;
        this.setConfig(config);
        this.canvasEl = document.createElement("canvas");
    }
    /**
     * reset part of the entity's config(only change the given parts)
     * @param config part of the new config
     */
    ColorExtractor.prototype.setConfig = function (config) {
        var _this = this;
        if (config.compresionRate !== undefined && config.compresionRate < 0)
            throw "compresion rate must not be negative";
        Object.keys(config).forEach(function (k) {
            var newVal = config[k];
            if (newVal === undefined)
                return;
            _this.config[k] = newVal;
        });
    };
    ColorExtractor.prototype.extractColor = function (image) {
        return __awaiter(this, void 0, void 0, function () {
            var imageEl, imageEl_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof image === "string") {
                            imageEl_1 = document.createElement("img");
                            imageEl_1.src = image;
                        }
                        else {
                            imageEl = image;
                        }
                        return [4 /*yield*/, new Promise(function (res) {
                                imageEl.addEventListener("load", res);
                            })];
                    case 1:
                        _a.sent();
                        this._extractColor(imageEl);
                        return [2 /*return*/, this.colors];
                }
            });
        });
    };
    ColorExtractor.prototype._extractColor = function (image) {
        var width = image.width, height = image.height;
        width *= this.config.compresionRate;
        height *= this.config.compresionRate;
        // fix canvas cors problem
        image.crossOrigin = "Anonymous";
        this.canvasEl.width = width;
        this.canvasEl.height = height;
        var ctx = this.canvasEl.getContext("2d");
        if (!ctx)
            throw "cannot get canvas context";
        ctx.drawImage(image, 0, 0, width, height);
        var imgData = ctx.getImageData(0, 0, width, height).data;
        var colors = this.getMainColors(imgData);
        this.colors = colors;
    };
    ColorExtractor.prototype.getMainColors = function (data) {
        var root = new octree_1.Node();
        octree_1.Node.toReduce = new Array(8).fill(0).map(function () { return []; });
        octree_1.Node.leafNum = 0;
        for (var i = 0; i < data.length; i += 4) {
            root.addColor([data[i], data[i + 1], data[i + 2]], 0);
            while (octree_1.Node.leafNum > this.config.topColorCount * 2)
                (0, octree_1.reduceTree)();
        }
        var record = {};
        (0, octree_1.colorsStats)(root, record);
        var result = [];
        for (var k in record) {
            result.push({ color: k, count: record[k] });
        }
        result.sort(function (a, b) { return b.count - a.count; });
        return result.slice(0, this.config.topColorCount);
    };
    /**
     * **after** extracted colors, choose the front ground color and background color within them
     * @returns `[bgColor, frontColor]`
     */
    ColorExtractor.prototype.chooseReadableColor = function () {
        if (!this.colors)
            throw "you haven't extracted colors, please call `extractColor` first";
        return (0, readableColor_1.chooseReadableColor)(this.colors.map(function (c) { return c.color; }));
    };
    return ColorExtractor;
}());
exports.ColorExtractor = ColorExtractor;
var defaultConfig = {
    compresionRate: 0.03,
    topColorCount: 4,
};
