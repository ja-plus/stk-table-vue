import { Ref } from 'vue';

type Params = {
    props: any;
    tableContainerRef: Ref<HTMLElement | undefined>;
};
export declare function useScrollRowByRow({ props, tableContainerRef }: Params): {
    isSRBRActive: import('vue').ComputedRef<any>;
    isDragScroll: Ref<boolean, boolean>;
};
export {};
