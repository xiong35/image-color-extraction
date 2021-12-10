/********************/
/********************/
import { PixelData } from "./utils";
/**
 * 0. 将每个点的 RGB 表示为二进制的一行, 堆叠后将每一列的不同编码对应成数字, 共 8 种组合
 *    RGB 通道逐列黏合之后的值就是其在某一层节点的子节点
 *    e.g. 如#FF7800，其中 R 通道为0xFF，也就是255，G 为 0x78 也就是120，B 为 0x00 也就是0。
 *         接下来我们把它们写成二进制逐行放下，那么就是：
 *          R: 1111 1111
 *          G: 0111 1000
 *          B: 0000 0000
 *         上述颜色的第一位黏合起来是100(2)，转化为十进制就是 4，所以这个颜色在第一层是放在根节点的第5个子节点当中
 *         第二位是 110(2) 也就是 6，那么它就是根节点的第5个儿子的第7个儿子
 * 1. 建立一棵空八叉树, 设置一个叶子节点个数上限
 * 2. 依次将像素按 0. 的算法插入树中
 *     (1) 若插入后叶子节点数小于上限, 则什么也不做
 *     (2) 若大于上限, 则对最底层的一个非叶子节点进行合并
 *         将其转换为叶子节点 rgb 值的平均数, 并清除其子节点
 * 3. 依此类推, 直到最后插入所有的像素, 所得八叉树的叶子节点即为主色调
 */
export declare class Node {
    static leafNum: number;
    static toReduce: Node[][];
    children: (Node | null)[];
    isLeaf: boolean;
    r: number;
    g: number;
    b: number;
    childrenCount: number;
    constructor(info?: {
        index: number;
        level: number;
    });
    addColor(color: PixelData, level: number): void;
}
export declare function reduceTree(): void;
export declare function colorsStats(node: Node, record: Record<string, number>): void;
