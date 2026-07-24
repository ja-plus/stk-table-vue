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

/** 缩放单位阈值表（从大到小匹配） */
const ABBR_UNITS: Record<'cn' | 'en', Array<[number, string]>> = {
    cn: [
        [1e8, '亿'],
        [1e4, '万'],
    ],
    en: [
        [1e9, 'B'],
        [1e6, 'M'],
        [1e3, 'K'],
    ],
};

/**
 * 给数字字符串的整数部分添加千分位分隔符。
 * @param numStr 不含符号的正数字符串（可含小数部分）
 */
function addThousandsSeparator(numStr: string): string {
    const [intPart, decPart] = numStr.split('.');
    const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart != null ? `${withSep}.${decPart}` : withSep;
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
export function formatNumber(value: unknown, options: FormatNumberOptions = {}): string {
    const { decimals, thousands = true, prefix = '', suffix = '', showSign = false, percent = false, abbr, abbrDecimals, placeholder = '--' } = options;

    // 空值判断（注意：Number('') === 0，必须先拦掉空字符串）
    if (value === null || value === undefined || value === '') {
        return placeholder;
    }
    const num = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(num)) {
        return placeholder;
    }

    // 符号基于原始值正负；0 不带符号
    const sign = num < 0 ? '-' : showSign && num > 0 ? '+' : '';
    let work = Math.abs(num);

    // 百分比
    if (percent) {
        work = work * 100;
    }

    // 单位缩放（与百分比互斥）
    let unit = '';
    if (abbr && !percent) {
        for (const [threshold, label] of ABBR_UNITS[abbr]) {
            if (work >= threshold) {
                work = work / threshold;
                unit = label;
                break;
            }
        }
    }

    // 小数位：缩放后优先 abbrDecimals，否则回落到 decimals，最终默认 2；未缩放时不强制
    let fractionDigits: number | null;
    if (unit) {
        fractionDigits = abbrDecimals ?? decimals ?? 2;
    } else {
        fractionDigits = decimals ?? null;
    }
    let numStr = fractionDigits == null ? String(work) : work.toFixed(fractionDigits);

    // 千分位
    if (thousands) {
        numStr = addThousandsSeparator(numStr);
    }

    const percentSuffix = percent ? '%' : '';
    return `${prefix}${sign}${numStr}${unit}${percentSuffix}${suffix}`;
}
