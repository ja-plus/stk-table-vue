export type RowDataType = {
    rowTitle: string;
    m1: CellDataType;
    m3: CellDataType;
    m6: CellDataType;
    y1: CellDataType;
};

export type CellDataType = {
    code: string;
    value: string;
    count: number;
    percent: number;
    bp: string;
};
