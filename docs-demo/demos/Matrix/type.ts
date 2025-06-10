export type RowDataType = {
    rowTitle: string;
} & Partial<Record<string, CellDataType>>;

export type CellDataType = {
    code: string;
    value: string;
    count: number;
    percent: number;
    bp: string;
};
