export declare const DEFAULT_COL_WIDTH = "100";
export declare const DEFAULT_TABLE_HEIGHT = 100;
export declare const DEFAULT_TABLE_WIDTH = 200;
export declare const DEFAULT_ROW_HEIGHT = 28;
/** highlight background */
export declare const HIGHLIGHT_COLOR: {
    light: {
        from: string;
        to: string;
    };
    dark: {
        from: string;
        to: string;
    };
};
export declare const HIGHLIGHT_DURATION = 2000;
/** highlight change frequency 1000/30 -> 30FPS */
export declare const HIGHLIGHT_ROW_CLASS = "highlight-row";
export declare const HIGHLIGHT_CELL_CLASS = "highlight-cell";
/** legacy sticky compatible mode  */
export declare const IS_LEGACY_MODE: boolean;
/** default props.smoothDefault */
export declare const DEFAULT_SMOOTH_SCROLL: boolean;
export declare const STK_ID_PREFIX = "stk";
/** expanded row key prefix */
export declare const EXPANDED_ROW_KEY_PREFIX = "expanded-";
/** cell key split str */
export declare const CELL_KEY_SEPARATE = "--";
export declare const DEFAULT_SORT_CONFIG: {
    emptyToBottom: false;
    stringLocaleCompare: false;
    sortChildren: false;
};
