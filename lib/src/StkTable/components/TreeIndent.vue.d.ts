declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    /** 行所处层级（根为 0），决定缩进宽度，也决定引导线覆盖的格数（只画祖先各格 0..level-1） */
    level: number;
    /** 是否绘制层级引导线（treeConfig.showGuide），关闭时只保留缩进 */
    showGuide?: boolean;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    /** 行所处层级（根为 0），决定缩进宽度，也决定引导线覆盖的格数（只画祖先各格 0..level-1） */
    level: number;
    /** 是否绘制层级引导线（treeConfig.showGuide），关闭时只保留缩进 */
    showGuide?: boolean;
}>>> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
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
