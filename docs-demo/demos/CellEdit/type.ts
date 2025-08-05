export type RowDataType = {
    id: number;
    name: string;
    age: number;
    address: string;
    /** 一行都进入编辑模式 */
    _isEditing?: boolean;
};

export type EditCellDataType = {
    value: string | number;
    isEditing: boolean;
    originalValue: string | number;
};
