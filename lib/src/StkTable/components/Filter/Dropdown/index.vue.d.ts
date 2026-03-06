import { FilterOption } from '../types';

declare function show(pos: {
    x: number;
    y: number;
}, opt?: FilterOption[]): void;
declare function clear(): void;
declare function hide(): void;
declare const _default: import('vue').DefineComponent<{}, {
    visible: import('vue').Ref<boolean, boolean>;
    show: typeof show;
    clear: typeof clear;
    hide: typeof hide;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    confirm: (options: FilterOption[]) => void;
}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{
    onConfirm?: ((options: FilterOption[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
