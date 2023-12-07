import { Component, VNode } from 'vue';
export type StkTableColumn<T> = {
  dataIndex: keyof T;
  title?: string;
  align?: 'right' | 'left' | 'center';
  headerAlign?: 'right' | 'left' | 'center';
  sorter?: boolean | Function;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  className?: string;
  sortField?: keyof T;
  sortType?: 'number' | 'string';
  fixed?: 'left' | null;
  customCell?: Component | VNode;
  customHeaderCell?: Component | VNode;
};
