import { computed, ref } from 'vue';
import { useAreaSelection, useAreaSelectionName } from './features';

type OnDemandFeature = {
    [useAreaSelectionName]: typeof useAreaSelection<any>;
};

export const ON_DEMAND_FEATURE: OnDemandFeature = {
    [useAreaSelectionName]: (() => {
        console.warn('useAreaSelection is not registered');
        return {
            config: computed(() => ({ enabled: false })),
            isSelecting: ref(false),
            onMD: () => {},
            getClass: () => [],
            getRowClass: () => [],
            get: () => ({ rows: [], cols: [], ranges: [] }),
            clear: () => {},
            copy: () => '',
        };
    }) as typeof useAreaSelection<any>,
};

type Feature = OnDemandFeature[keyof OnDemandFeature];

export function registerFeature(feature: Feature | Feature[]) {
    const features = Array.isArray(feature) ? feature : [feature];
    features.forEach(f => {
        const fnName = (f as any).stkName;
        if (!fnName) {
            console.warn('invalid feature');
            return;
        }
        (ON_DEMAND_FEATURE as any)[fnName] = f as any;
    });
}
