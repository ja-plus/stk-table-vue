/// <reference types="vite/client" />
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<object, object, any>;
    export default component;
}

interface Window {
    __STK_TB_ID_COUNT__: number;
}
