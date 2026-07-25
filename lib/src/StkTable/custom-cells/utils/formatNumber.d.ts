/**
 * 数字格式化选项
 *
 * NumberCell / ChangeCell 共享的格式化配置。
 */
export interface FormatNumberOptions {
    /** 小数位数（四舍五入）。不传则不强制处理小数位 */
    decimals?: number;
    /** 是否使用千分位分隔符，默认 true */
    thousands?: boolean;
    /** 前缀，如 '¥'、'$' */
    prefix?: string;
    /** 后缀，如 '元'、'股' */
    suffix?: string;
    /** 正数是否强制显示 '+' 号，默认 false（负数始终带 '-'） */
    showSign?: boolean;
    /** 百分比模式：值 ×100 并追加 '%'，默认 false。与 abbr 互斥 */
    percent?: boolean;
    /** 单位缩放：'cn' = 万/亿，'en' = K/M/B。不传则不缩放。与 percent 互斥 */
    abbr?: 'cn' | 'en';
    /** 缩放后保留的小数位，默认 2 */
    abbrDecimals?: number;
    /** 空值(null/undefined/'')或非数字时的占位符，默认 '--' */
    placeholder?: string;
}
/**
 * 数字格式化纯函数（NumberCell / ChangeCell 共享内核）。
 *
 * 处理管线：空值判断 → 取符号 → 百分比 → 单位缩放 → 小数位 → 千分位 → 拼装。
 *
 * @param value 原始值（数字或可转为数字的字符串）
 * @param options 格式化选项
 * @returns 格式化后的字符串；空值或非数字返回 placeholder
 */
export declare function formatNumber(value: unknown, options?: FormatNumberOptions): string;
