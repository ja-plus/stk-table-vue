declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    /** 当前是否选中 */
    checked?: boolean;
    /** 是否半选状态 */
    indeterminate?: boolean;
    /** 自定义 checkbox 组件（如 Element Plus / Ant Design Vue 的 Checkbox） */
    customComponent?: any;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (checked: boolean) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    /** 当前是否选中 */
    checked?: boolean;
    /** 是否半选状态 */
    indeterminate?: boolean;
    /** 自定义 checkbox 组件（如 Element Plus / Ant Design Vue 的 Checkbox） */
    customComponent?: any;
}>>> & Readonly<{
    onChange?: ((checked: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
