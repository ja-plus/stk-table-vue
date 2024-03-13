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
export const HIGHLIGHT_FREQ = 100;

/** 高亮行class */
export const HIGHLIGHT_ROW_CLASS = 'highlight-row';
/** 高连单元格class */
export const HIGHLIGHT_CELL_CLASS = 'highlight-cell';

let _chromeVersion = 0;
try {
    const userAgent = navigator.userAgent.match(/chrome\/\d+/i);
    if (userAgent) {
        _chromeVersion = +userAgent[0].split('/')[1];
    }
} catch (e) {
    console.error('Cannot get Chrome version', e);
}
/** 是否兼容低版本模式 */
export const IS_LEGACY_MODE = _chromeVersion < 56;
