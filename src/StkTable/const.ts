import { RowActiveOption, SortConfig } from './types';
import { getBrowsersVersion } from './utils';

export const DEFAULT_COL_WIDTH = 100;

export const DEFAULT_TABLE_HEIGHT = 100;
export const DEFAULT_TABLE_WIDTH = 200;
export const DEFAULT_ROW_HEIGHT = 28;

/** highlight background */
export const HIGHLIGHT_COLOR = {
    light: { from: '#71a2fd', to: '#fff' },
    dark: { from: '#1e4c99', to: '#181c21' },
};
export const HIGHLIGHT_DURATION = 2000;

/** highlight change frequency 1000/30 -> 30FPS */
// export const HIGHLIGHT_FREQ = 1000 / 30;

export const HIGHLIGHT_ROW_CLASS = 'highlight-row';
export const HIGHLIGHT_CELL_CLASS = 'highlight-cell';

const _chromeVersion = getBrowsersVersion('chrome');
const _firefoxVersion = getBrowsersVersion('firefox');

/** legacy sticky compatible mode  */
export const IS_LEGACY_MODE = _chromeVersion < 56 || _firefoxVersion < 59;

/** default props.smoothDefault */
export const DEFAULT_SMOOTH_SCROLL = _chromeVersion < 85;

export const STK_ID_PREFIX = 'stk';

/** expanded row key prefix */
export const EXPANDED_ROW_KEY_PREFIX = 'expanded-';

/** cell key split str */
export const CELL_KEY_SEPARATE = '--';

export const DEFAULT_SORT_CONFIG = {
    emptyToBottom: false,
    stringLocaleCompare: false,
    sortChildren: false,
} satisfies SortConfig<any>;

export const DEFAULT_ROW_ACTIVE_CONFIG: Required<RowActiveOption<any>> = {
    enabled: true,
    disabled: () => false,
    revokable: true,
};
