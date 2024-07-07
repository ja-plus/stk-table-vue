import { getBrowsersVersion } from './utils';

export const DEFAULT_COL_WIDTH = '100';

export const DEFAULT_TABLE_HEIGHT = 100;
export const DEFAULT_TABLE_WIDTH = 200;
export const DEFAULT_ROW_HEIGHT = 28;

/** 高亮背景色 */
export const HIGHLIGHT_COLOR = {
    light: { from: '#71a2fd', to: '#fff' },
    dark: { from: '#1e4c99', to: '#181c21' },
};
/** 高亮持续时间 */
export const HIGHLIGHT_DURATION = 2000;

/** 高亮变更频率 */
export const HIGHLIGHT_FREQ = 1000 / 30;

/** 高亮行class */
export const HIGHLIGHT_ROW_CLASS = 'highlight-row';
/** 高连单元格class */
export const HIGHLIGHT_CELL_CLASS = 'highlight-cell';

const _chromeVersion = getBrowsersVersion('chrome');
const _firefoxVersion = getBrowsersVersion('firefox');

/** 低版本sticky兼容模式  */
export const IS_LEGACY_MODE = _chromeVersion < 56 || _firefoxVersion < 59;

/** 默认props.smoothDefault */
export const DEFAULT_SMOOTH_SCROLL = _chromeVersion < 85;

export const STK_ID_PREFIX = 'stk';
