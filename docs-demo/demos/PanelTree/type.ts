export type RowDataType = {
    key: string;
    id: string;
    level?: number;
    name?: string;
    age?: number;
    address?: string;
    email?: string;
    phone?: string;
    website?: string;
    company?: string;
    children?: RowDataType[];
};
