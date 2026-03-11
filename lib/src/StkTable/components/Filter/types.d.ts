export interface FilterOption {
    label: string;
    value: any;
    selected?: boolean;
}
export interface FilterStatus {
    value: FilterOption['value'][];
}
export interface UseFilterOptions {
    filterRemote: boolean;
}
