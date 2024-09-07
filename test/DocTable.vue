<template>
    <div>
        <h2>API</h2>
        <StkTable style="overflow: unset" theme="dark" :columns="docTableColumns" :data-source="docTableData"></StkTable>
    </div>
</template>
<script lang="ts" setup>
import { StkTable, StkTableColumn } from '../src/StkTable';

const docTableColumns: StkTableColumn<any>[] = [
    { title: '字段', dataIndex: 'key', fixed: 'left' },
    { title: '描述', dataIndex: 'desc' },
    { title: '取值', dataIndex: 'value' },
    { title: '默认', dataIndex: 'defaultValue' },
];
const docTableData = [
    { key: 'tableProps', desc: '', value: '' },
    { key: 'rowKey', desc: '一行的唯一键', value: 'string | (row) => string' },
    { key: 'colKey', desc: '一列的唯一键', value: 'string | (col) => string', defaultValue: 'dataIndex' },
    { key: 'height', desc: '高度' },
    { key: 'width', desc: 'table宽度', value: 'string' },
    { key: 'maxWidth', desc: '最大宽度', value: 'string', defaultValue: 'max-content' },
    { key: 'minWidth', desc: '最小宽度', value: 'string' },
    { key: 'rowHeight', desc: '行高', value: 'number', defaultValue: '28' },
    { key: 'headerRowHeight', desc: '表头行高', value: 'number', defaultValue: '与rowHeight相同' },
    { key: 'stripe', desc: '斑马纹', value: 'boolean', defaultValue: 'false' },
    { key: 'fixedMode', desc: 'table-layout 切换为fixed。此模式仅生效col.width', value: 'boolean', defaultValue: 'false' },
    { key: 'showOverflow', desc: 'td文本溢出展示...', value: 'boolean', defaultValue: 'false' },
    { key: 'showHeaderOverflow', desc: 'th文本溢出展示...', value: 'boolean', defaultValue: 'false' },
    {
        key: 'sortRemote',
        desc: '服务端排序，开启后，点击表头将不触发排序',
        value: 'boolean',
        defaultValue: 'false',
    },
    { key: 'noDataFull', desc: '暂无数据占满表格', value: 'boolean', defaultValue: 'false' },
    { key: 'showNoData', desc: '是否展示暂无数据', value: 'boolean', defaultValue: 'true' },
    { key: 'headerDrag', desc: '是否可拖动表头', value: 'boolean', defaultValue: 'false' },
    { key: 'emptyCellText', desc: '空单元格的占位文字', value: 'string', defaultValue: '--' },
    { key: 'showTrHoverClass', desc: '是否增加行hover class', value: 'boolean', defaultValue: 'false' },
    { key: 'virtual', desc: '是否开启虚拟滚动', defaultValue: 'false' },
    { key: 'virtualX', desc: '是否开启横向虚拟滚动。一定要设置列宽。', defaultValue: 'false' },
    { key: 'columns', desc: '列配置', value: 'columnOption[]' },
    { key: 'dataSource', desc: '数据源', value: 'object[]' },
    {
        key: 'colResizable',
        desc: '列拖动,列宽拖动时，每一列都必须要有width，且minWidth/maxWidth不生效',
        value: 'boolean',
        defaultValue: 'false',
    },
    { key: 'colMinWidth', desc: '列拖动的最小宽度', value: 'number', defaultValue: '10' },
    { key: 'headless', desc: '是否展示表头', value: 'boolean', defaultValue: 'false' },
    {
        key: 'bordered',
        desc: `边框。单元格分割线。默认横竖都有"h" - 仅展示横线"v" - 仅展示竖线"body-v" - 仅表体展示竖线`,
        value: 'boolean|"h"|"v"|"body-v"',
        defaultValue: 'true',
    },
    {
        key: 'autoResize',
        desc: '自动重新计算虚拟滚动高度宽度。默认true。[非响应式]',
        value: 'boolean | (() => void)',
        defaultValue: 'true',
    },
    { key: '------------', desc: '---------' },
    { key: 'columnOption', desc: '', value: '' },
    { key: 'title', desc: '名称' },
    { key: 'dataIndex', desc: '数据key，必需要唯一' },
    {
        key: 'fixed',
        desc: '固定列，暂不支持多级表头固定列。left列需要放在columns最前，right列需要放在columns最后。',
        value: '"left"|"right"',
    },
    { key: 'headerClassName', desc: '一列的表头class' },
    { key: 'className', desc: '一列的单元格class' },
    { key: 'width', desc: '这列th/td 的宽度。设置该属性，自动设置minWidth = maxWidth = width', value: 'xxpx' },
    { key: 'minWidth', desc: '这列th/td 的最小宽度。在总列宽不够table宽时，列宽被压缩的最小值。', value: 'xxpx' },
    { key: 'maxWidth', desc: '这列th/td 的最大宽度。可被内容文字撑开的最大宽度。', value: 'xxpx' },
    {
        key: 'sorter',
        desc: '是否开启排序。可传方法。且sortBy、sortType不会生效',
        value: 'boolean | function(data, {order, column}):any[]',
        defaultValue: 'false',
    },
    { key: 'sortField', desc: '使用其他字段排序的key', value: 'string' },
    { key: 'sortType', desc: '排序字段类型', value: 'string | number', defaultValue: 'string' },
    { key: 'align', desc: '表列对齐', value: '"left"|"center"' },
    { key: 'headerAlign', desc: '表头对齐' },
    { key: 'customHeaderCell', desc: '自定义表头渲染内容。同customCell' },
    {
        key: 'customCell',
        desc: '自定义列td的渲染。接收一个vue组件，也可返回jsx 如return {render(h){return jsx}}，组件接受props:["row","col"]',
        value: 'VNode | Component',
    },
    { key: '------------', desc: '---------' },
    { key: 'TableEvents', desc: '', value: '' },
    { key: 'current-change', desc: '当前行改变', value: '(e:MouseEvent,row):void' },
    { key: 'row-menu', desc: '行右键菜单', value: '(e:MouseEvent,row):void' },
    { key: 'header-row-menu', desc: '表头行右键菜单', value: '(e:MouseEvent,row):void' },
    { key: 'row-click', desc: '行单击', value: '(e:MouseEvent,row):void' },
    { key: 'row-dblclick', desc: '行双击', value: '(e:MouseEvent,row):void' },
    { key: 'sort-change', desc: '筛选改变', value: '(e:MouseEvent,row,col,sortedData:any[]):void' },
    { key: 'cell-click', desc: '单元格单击', value: '(e:MouseEvent,row,col):void' },
    { key: 'header-cell-click', desc: '表头单元格单击', value: '(e:MouseEvent,row,col):void' },
    { key: 'scroll', desc: '滚动', value: '(e:MouseEvent, data:{startIndex:number, endIndex:number}):void' },
    { key: 'scroll-x', desc: '横向滚动', value: '(e:MouseEvent):void' },
    {
        key: 'col-order-change',
        desc: '表头拖动改变列顺序时',
        value: '(sourceDataIndex:string,targetDataIndex:string):void',
    },
];
</script>
