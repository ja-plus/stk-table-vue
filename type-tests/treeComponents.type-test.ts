/**
 * 公共树组件类型编译期断言（无运行时行为）。
 * 校验方式：`pnpm test:types`（@ts-expect-error 位置必须报错、其余必须通过）
 */
import type { Component } from 'vue';
import { StkTreeCell, StkTreeFoldIcon, StkTreeIndent } from '../src/StkTable/index';
import type { StkTableColumn } from '../src/StkTable/index';
// CustomCellProps 按既有约定从类型入口导入（与 docs-src 文档、docs-demo 一致）
import type { CustomCellProps } from '../src/StkTable/types/index';

// —— 三个公共组件都从包入口导出，且是可用的 Vue 组件
const cellAsComponent: Component = StkTreeCell;
const indentAsComponent: Component = StkTreeIndent;
const foldIconAsComponent: Component = StkTreeFoldIcon;
void cellAsComponent;
void indentAsComponent;
void foldIconAsComponent;

type Row = { id: string; name: string };

// —— StkTreeCell 可直接配置为 customCell
const columns: StkTableColumn<Row>[] = [
    { type: 'tree-node', dataIndex: 'name', customCell: StkTreeCell },
];

// —— customCell 上下文包含公开树状态
type TreeCellProps = CustomCellProps<Row>;
const level: TreeCellProps['level'] = 1;
const expandable: TreeCellProps['expandable'] = true;
const treeLoading: TreeCellProps['treeLoading'] = false;
const treeExpanded: TreeCellProps['treeExpanded'] = true;
const showGuide: TreeCellProps['showGuide'] = true;
void level;
void expandable;
void treeLoading;
void treeExpanded;
void showGuide;

// —— 非法赋值必须报错
// @ts-expect-error level 不接受字符串
const badLevel: TreeCellProps['level'] = '1';
// @ts-expect-error customCell 不接受数字
const badColumns: StkTableColumn<Row>[] = [{ dataIndex: 'name', customCell: 1 }];
void badLevel;
void badColumns;
void columns;