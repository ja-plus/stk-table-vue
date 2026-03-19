import { computed, ref } from 'vue';
import { useAreaSelection } from './features';

type OnDemandFeature = {
    [useAreaSelection.name]: typeof useAreaSelection<any>;
};

export const ON_DEMAND_FEATURE: OnDemandFeature = {
    [useAreaSelection.name]: (() => {
        console.warn('useAreaSelection is not registered');
        return {
            config: computed(() => ({ enabled: false })),
            isSelecting: ref(false),
            onMD: () => {},
            getClass: () => [],
            get: () => ({ rows: [], cols: [], range: null }),
            clear: () => {},
            copy: () => '',
        };
    }) as typeof useAreaSelection<any>,
};

type Feature = OnDemandFeature[keyof OnDemandFeature];

export function registerFeature(feature: Feature | Feature[]) {
    const features = Array.isArray(feature) ? feature : [feature];
    features.forEach(f => {
        (ON_DEMAND_FEATURE as any)[f.name] = f as any;
    });
}
