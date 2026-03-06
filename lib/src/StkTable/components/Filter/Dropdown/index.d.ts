import { FilterOption } from '../types';

export declare function getDropdownIns(onConfirm: (values: FilterOption['value'][]) => void): Promise<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{}> & Readonly<{
    onConfirm?: ((options: FilterOption[]) => any) | undefined;
}>, {
    visible: import('vue').Ref<boolean, boolean>;
    show: (pos: {
        x: number;
        y: number;
    }, opt?: FilterOption[]) => void;
    clear: () => void;
    hide: () => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    confirm: (options: FilterOption[]) => void;
}, import('vue').PublicProps, {}, true, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<{}> & Readonly<{
    onConfirm?: ((options: FilterOption[]) => any) | undefined;
}>, {
    visible: import('vue').Ref<boolean, boolean>;
    show: (pos: {
        x: number;
        y: number;
    }, opt?: FilterOption[]) => void;
    clear: () => void;
    hide: () => void;
}, {}, {}, {}, {}>>;
