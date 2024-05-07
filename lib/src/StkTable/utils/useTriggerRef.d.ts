import { Ref } from 'vue';

type UseTriggerRef<T> = {
    getRef: () => Ref<T>;
    getValue: () => T;
    setValue: (v: T) => void;
    triggerRef: () => void;
};
/**
 * 创建一个可触发更新的引用对象。
 * @template T 引用对象的类型。
 * @param initialValue 初始值。
 * @returns 包含获取引用、获取值、设置值和触发更新的函数的对象。
 */
export declare function useTriggerRef<T>(initialValue: T): UseTriggerRef<T>;
export {};
