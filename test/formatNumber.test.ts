import { describe, it, expect } from 'vitest';
import { formatNumber } from '../src/StkTable/custom-cells/utils/formatNumber';

describe('formatNumber', () => {
    describe('空值与非数字', () => {
        it('null/undefined/空字符串返回默认占位符 --', () => {
            expect(formatNumber(null)).toBe('--');
            expect(formatNumber(undefined)).toBe('--');
            expect(formatNumber('')).toBe('--');
        });
        it('非数字字符串返回占位符', () => {
            expect(formatNumber('abc')).toBe('--');
        });
        it('可自定义占位符', () => {
            expect(formatNumber(null, { placeholder: 'N/A' })).toBe('N/A');
        });
        it('0 正常格式化而非占位符', () => {
            expect(formatNumber(0)).toBe('0');
        });
    });

    describe('小数位与千分位', () => {
        it('默认开启千分位', () => {
            expect(formatNumber(1234567)).toBe('1,234,567');
        });
        it('保留小数位并四舍五入', () => {
            expect(formatNumber(3.14159, { decimals: 2 })).toBe('3.14');
            expect(formatNumber(2.71828, { decimals: 2 })).toBe('2.72');
        });
        it('可关闭千分位', () => {
            expect(formatNumber(1234567, { thousands: false })).toBe('1234567');
        });
        it('千分位与小数位组合', () => {
            expect(formatNumber(1234567.891, { decimals: 2 })).toBe('1,234,567.89');
        });
        it('负数', () => {
            expect(formatNumber(-1234.5, { decimals: 1 })).toBe('-1,234.5');
        });
    });

    describe('符号与百分比', () => {
        it('showSign 正数加 +', () => {
            expect(formatNumber(5, { showSign: true })).toBe('+5');
        });
        it('showSign 不影响负数与 0', () => {
            expect(formatNumber(-5, { showSign: true })).toBe('-5');
            expect(formatNumber(0, { showSign: true })).toBe('0');
        });
        it('percent 乘 100 加 %', () => {
            expect(formatNumber(0.05, { percent: true, decimals: 2 })).toBe('5.00%');
        });
        it('percent 结合 showSign', () => {
            expect(formatNumber(0.05, { percent: true, decimals: 2, showSign: true })).toBe('+5.00%');
        });
    });

    describe('前后缀', () => {
        it('prefix / suffix', () => {
            expect(formatNumber(1234.5, { prefix: '¥', decimals: 2 })).toBe('¥1,234.50');
            expect(formatNumber(100, { suffix: '元' })).toBe('100元');
        });
        it('prefix 位于符号之前', () => {
            expect(formatNumber(-100, { prefix: '$' })).toBe('$-100');
        });
    });

    describe('单位缩放 abbr=cn', () => {
        it('万', () => {
            expect(formatNumber(12345, { abbr: 'cn' })).toBe('1.23万');
        });
        it('亿', () => {
            expect(formatNumber(123456789, { abbr: 'cn' })).toBe('1.23亿');
        });
        it('不足万不缩放', () => {
            expect(formatNumber(9999, { abbr: 'cn' })).toBe('9,999');
        });
        it('abbrDecimals 控制缩放后小数位', () => {
            expect(formatNumber(12345, { abbr: 'cn', abbrDecimals: 1 })).toBe('1.2万');
        });
        it('负数缩放', () => {
            expect(formatNumber(-12345, { abbr: 'cn' })).toBe('-1.23万');
        });
    });

    describe('单位缩放 abbr=en', () => {
        it('K / M / B', () => {
            expect(formatNumber(1500, { abbr: 'en' })).toBe('1.50K');
            expect(formatNumber(2500000, { abbr: 'en' })).toBe('2.50M');
            expect(formatNumber(3200000000, { abbr: 'en' })).toBe('3.20B');
        });
    });
});
