/**
 * scrollTo 类型编译期断言（无运行时行为）。
 * 校验方式：`pnpm test:types`（等价 tsc 校验，@ts-expect-error 位置必须报错、其余必须通过）
 */
import type { ScrollAxisTarget, ScrollToFn, ScrollToOptions } from '../src/StkTable/index';

declare const scrollTo: ScrollToFn;

// —— 旧数字形态（向后兼容）
scrollTo();
scrollTo(20);
scrollTo(null, 10);
scrollTo(20, null);
scrollTo(undefined, undefined);

// —— options 重载各合法形态
scrollTo({});
scrollTo({ top: 100, left: 200 });
scrollTo({ top: 100 });
scrollTo({ left: 200 });
scrollTo({ top: { index: 0 } });
scrollTo({ top: { key: 'row-1' } });
scrollTo({ top: { key: 42 } });
scrollTo({ top: { index: 1, key: 'row-1', px: 5 } });
scrollTo({ top: { px: -10 } });
scrollTo({ left: { index: 3 } });
scrollTo({ left: { key: 'name' } });
scrollTo({ top: { index: 5 }, left: { index: 3 }, behavior: 'smooth' });
scrollTo({ top: 100, behavior: 'auto' });
scrollTo({ top: 100, behavior: 'instant' });

// —— 公共类型本身可独立使用
const target: ScrollAxisTarget = { index: 1, px: 2 };
const options: ScrollToOptions = { top: target, behavior: 'smooth' };
void target;
void options;

// —— 非法形态必须报错
// @ts-expect-error top 不接受字符串
scrollTo({ top: 'x' });
// @ts-expect-error behavior 仅接受 ScrollBehavior
scrollTo({ top: 100, behavior: 'fast' });
// @ts-expect-error options 重载不接受第二个参数
scrollTo({ top: 100 }, 2);
// @ts-expect-error index 必须是 number
const badTarget: ScrollAxisTarget = { index: '1' };
// @ts-expect-error px 必须是 number
const badTarget2: ScrollAxisTarget = { px: '1' };
void badTarget;
void badTarget2;
