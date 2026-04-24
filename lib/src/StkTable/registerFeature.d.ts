import { useAreaSelection, useAreaSelectionName, useRowDragSelection, useRowDragSelectionName } from './features';

type OnDemandFeature = {
    [useAreaSelectionName]: typeof useAreaSelection<any>;
    [useRowDragSelectionName]: typeof useRowDragSelection<any>;
};
export declare const ON_DEMAND_FEATURE: OnDemandFeature;
type Feature = OnDemandFeature[keyof OnDemandFeature];
export declare function registerFeature(feature: Feature | Feature[]): void;
export {};
