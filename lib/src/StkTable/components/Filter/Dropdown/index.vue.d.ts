import { FilterOption } from '../types';

declare function show(pos: {
    x: number;
    y: number;
}, opt: FilterOption[], onConfirm: (values: FilterOption['value'][]) => void): void;
declare function hide(): void;
declare function setTheme(t: 'light' | 'dark'): void;
declare const _default: import('vue').DefineComponent<{}, {
    visible: import('vue').Ref<boolean, boolean>;
    show: typeof show;
    hide: typeof hide;
    setTheme: typeof setTheme;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
