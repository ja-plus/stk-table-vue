import { CustomCellProps } from '../types';

declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<CustomCellProps<any> & {
    /** 是否按层级绘制竖向引导线（treeConfig.showGuide），关闭时保持既有纯缩进行为 */
    showGuide?: boolean;
    /** 引导线左偏移量，CSS 长度（如 `4px`）：把线校正到居中自定义展开图标的中心，不影响缩进与标签 */
    offset?: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<CustomCellProps<any> & {
    /** 是否按层级绘制竖向引导线（treeConfig.showGuide），关闭时保持既有纯缩进行为 */
    showGuide?: boolean;
    /** 引导线左偏移量，CSS 长度（如 `4px`）：把线校正到居中自定义展开图标的中心，不影响缩进与标签 */
    offset?: string;
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
