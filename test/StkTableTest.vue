<template>
    <div>
        <button @click="handleClearSorter">clearSorter</button>
        <button @click="handleClearTableData">clearTableData</button>
        <button @click="addRow()">pushRow</button>
        <button @click="addRow(100)">push100Row</button>
        <button @click="addRow(1, true)">unshiftRow</button>
        <button @click="addColumn()">addColumn</button>
        <button @click="deleteColumn()">deleteColumn</button>
        <button @click="props.showOverflow = !props.showOverflow">showOverflow:{{ props.showOverflow }}</button>
        <button @click="props.showHeaderOverflow = !props.showHeaderOverflow">showHeaderOverflow:{{ props.showHeaderOverflow }}</button>
        <button @click="props.sortRemote = !props.sortRemote">sortRemote:{{ props.sortRemote }}</button>
        <button @click="props.theme === 'light' ? (props.theme = 'dark') : (props.theme = 'light')">theme:{{ props.theme }}</button>
        <button @click="props.headless = !props.headless">headless:{{ props.headless }}</button>
        <button @click="props.colResizable = !props.colResizable">colResizable:{{ props.colResizable }}</button>
        <span> border: </span>
        <input v-model="props.bordered" type="radio" name="border" value="true" /> true
        <input v-model="props.bordered" type="radio" name="border" value="h" />horizontal
        <input v-model="props.bordered" type="radio" name="border" value="v" /> vertical
        <input v-model="props.bordered" type="radio" name="border" value="body-v" />body-vertical
    </div>
    <div ref="stkTableParent" class="stk-table-parent">
        <StkTable
            ref="stkTable"
            v-bind="props"
            v-model:columns="columns"
            row-key="name"
            :data-source="dataSource"
            @current-change="onCurrentChange"
            @row-menu="onRowMenu"
            @header-row-menu="onHeaderRowMenu"
            @row-click="onRowClick"
            @row-dblclick="onRowDblclick"
            @sort-change="handleSortChange"
            @cell-click="onCellClick"
            @header-cell-click="onHeaderCellClick"
            @scroll="onTableScroll"
            @col-order-change="onColOrderChange"
        ></StkTable>
    </div>
    <!-- <StkTableC
        ref="stkTableC"
        row-key="name"
        :no-data-full="true"
        :virtual="true"
        :style="{ height: props.height }"
        :columns="columns"
        :data-source="dataSource"
        @current-change="onCurrentChange"
        @row-dblclick="onRowDblclick"
        @col-order-change="onColOrderChange2"
    ></StkTableC> -->

    <div>
        columns:
        <div v-for="col in columns" :key="col.dataIndex">{{ col }}</div>
    </div>

    <FixedMode></FixedMode>
    <StkTableInsertSort />

    <hr />
    <div style="width: max-content">
        <h2>API</h2>
        <StkTable theme="dark" :columns="docTableColumns" :data-source="docTableData"></StkTable>
    </div>
</template>

<script lang="tsx">
import { h } from 'vue';
import { StkTable } from '../src/StkTable/index';
// import { StkTable } from 'stk-table-vue';
//import StkTableC from '../history/StkTableC/index.vue'; // 兼容版本 fixedLeft
import StkTableInsertSort from './StkTableInsertSort.vue'; // 插入排序
import FixedMode from './FixedMode.vue';
import DragResize from './utils/DragResize';

export default {
    name: 'StkTableTest',
    components: { StkTable, StkTableInsertSort, FixedMode },
    data() {
        return {
            props: {
                rowKey: 'name',
                theme: 'dark',
                showOverflow: false,
                showHeaderOverflow: false,
                sortRemote: false,
                // minWidth: 'auto',
                colResizable: true,
                headerDrag: true,
                virtual: true,
                virtualX: true,
                noDataFull: true,
                headless: false,
                bordered: true,
            },
            columns: [
                // {
                //   title: 'BasicInfo',
                //   children: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    fixed: 'left',
                    width: '200px',
                    headerClassName: 'my-th',
                    className: 'my-td',
                    sorter: true,
                    customHeaderCell: props => {
                        // render(h) {
                        return h(
                            'span',
                            { style: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap' },
                            props.col.title + '(render) text-overflow,',
                        );
                        // },
                    },
                },
                {
                    title: 'Age',
                    dataIndex: 'age',
                    fixed: 'left',
                    width: '100px', // 为确保横向滚动准确，列宽一定要固定，minWidth,maxWidth要相等
                    sorter(data, { order, column }) {
                        // console.log(data, order, column);
                        if (order === 'desc') return data.sort((a, b) => b.age - a.age);
                        else if (order === 'asc') return data.sort((a, b) => a.age - b.age);
                    },
                    align: 'right',
                    headerAlign: 'right',
                },
                //   ]
                // },

                {
                    title: 'Gender',
                    dataIndex: 'gender',
                    // fixed: 'right',
                    width: '150px',
                    // minWidth: '150px',
                    sorter: true,
                    sortType: 'number', // 指定为数字排序
                },
                {
                    title: 'Email(sortBy:name)',
                    dataIndex: 'email',
                    width: '150px',
                    sorter: true,
                    sortBy: 'name',
                },
                /** overflow 必须设置maxWidth */
                { title: 'Address', dataIndex: 'address', width: '100px' },
                { title: 'Address', dataIndex: 'address1', width: '100px' },
                { title: 'Address', dataIndex: 'address2', width: '100px' },
                { title: 'Address', dataIndex: 'address3', width: '100px' },
                { title: 'R', width: '50px', fixed: 'right' },
                {
                    title: 'Operate',
                    dataIndex: 'Operate',
                    width: '150px',
                    fixed: 'right',
                    // customCell() {
                    //     return (
                    //         <button>
                    //             <a href="#">+add</a>
                    //         </button>
                    //     );
                    // },
                },
            ],
            dataSource: new Array(150)
                .fill(0)
                .map((it, i) => ({
                    name: 'name' + i,
                    age: Math.ceil(Math.random() * 100),
                    email: 'add@sa.com',
                    gender: Number(Math.random() * 100 - 50).toFixed(2),
                    address: 'ahshshsshshhs',
                }))
                .concat(new Array(20000).fill({})),
            addIndex: 0,
            docTableColumns: [
                { title: '字段', dataIndex: 'key' },
                { title: '描述', dataIndex: 'desc' },
                { title: '取值', dataIndex: 'value' },
                { title: '默认', dataIndex: 'defaultValue' },
            ],
            docTableData: [
                { key: 'tableProps', desc: '', value: '' },
                { key: 'rowKey', desc: '一行的唯一键', value: 'string | (row) => string' },
                { key: 'colKey', desc: '一列的唯一键', value: 'string | (col) => string', defaultValue: 'dataIndex' },
                { key: 'height', desc: '高度' },
                { key: 'width', desc: 'table宽度', value: 'string' },
                { key: 'maxWidth', desc: '最大宽度', value: 'string', defaultValue: 'max-content' },
                { key: 'minWidth', desc: '最小宽度', value: 'string' },
                { key: 'fixedMode', desc: 'table-layout 切换为fixed。此模式仅生效col.width', value: 'boolean', default: 'false' },
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
                    value: 'boolean',
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
                { key: 'scroll', desc: '滚动', value: '(e:MouseEvent):void' },
                {
                    key: 'col-order-change',
                    desc: '表头拖动改变列顺序时',
                    value: '(sourceDataIndex:string,targetDataIndex:string):void',
                },
            ],
        };
    },
    mounted() {
        new DragResize(this.$refs.stkTableParent);
        setInterval(() => {
            this.$refs.stkTable?.setHighlightDimCell('add1', 'age');
        }, 2500);
        setInterval(() => {
            this.$refs.stkTable?.setHighlightDimCell('add2', 'gender');
        }, 2000);
        setInterval(() => {
            this.$refs.stkTable?.setHighlightDimRow(['add0']);
        }, 3000);
    },
    methods: {
        handleHeightInput(e) {
            this.props.height = e.target.value + 'px';
            this.$nextTick(() => {
                this.$refs.stkTable?.initVirtualScroll();
            });
        },
        onCurrentChange(e, row) {
            console.log('current-change', e, row);
        },
        onRowMenu(e, row) {
            console.log('row-menu:', e, row);
        },
        onHeaderRowMenu(e) {
            console.log('header-row-menu:', e);
        },
        onRowClick(e, row) {
            console.log('row-click:', e, row);
        },
        onRowDblclick(e, row) {
            console.log('row-dblclick:', e, row);
        },
        onCellClick(e, row, col) {
            // e.stopPropagation();
            console.log('cell-click:', e, row, col);
        },
        onHeaderCellClick(e, row) {
            console.log('header-cell-click:', e, row);
        },
        onTableScroll(e, data) {
            console.log(data);
            const { startIndex, endIndex } = data;

            // console.log(
            //   'scroll:',
            //   e.target.scrollHeight,
            //   e.target.clientHeight,
            //   'top:',
            //   e.target.scrollTop,
            //   'left:',
            //   e.target.scrollLeft,
            // );
        },
        handleClearSorter() {
            this.$refs.stkTable.resetSorter();
            // this.$refs.stkTableC.resetSorter();
        },
        handleClearTableData() {
            this.dataSource = [];
            // this.dataSource2 = [];
        },
        handleSortChange(col, order) {
            console.log('排序改变事件触发：', col, order);
        },
        onColOrderChange(sourceKey, targetKey) {
            console.log(sourceKey, targetKey);
            const sourceIndex = this.columns.findIndex(it => it.dataIndex === sourceKey);
            const targetIndex = this.columns.findIndex(it => it.dataIndex === targetKey);
            // delete
            const deleteEle = this.columns.splice(sourceIndex, 1);
            // insert
            this.columns.splice(targetIndex, 0, deleteEle[0]);
            this.columns = [...this.columns];
        },
        /** stkTableC列顺序变化 */
        onColOrderChange2(sourceIndex, targetIndex) {
            console.log(sourceIndex, targetIndex, 'sdf');
            const targetCol = this.columns[targetIndex];
            const sourceCol = this.columns.splice(sourceIndex, 1)[0];
            // 非固定列移动到固定列
            if (targetCol.fixed === 'left' && !sourceCol.fixed) {
                sourceCol.fixed = 'left';
                const nextNotFixedIndex = this.columns.findIndex(it => it.fixed === undefined);
                delete this.columns[nextNotFixedIndex - 1].fixed;
            } else if (sourceCol.fixed === 'left' && !targetCol.fixed) {
                // 固定列移动到非固定列
                delete sourceCol.fixed;
                // 下一个固定列变为固定列
                const nextNotFixedCol = this.columns.find(it => it.fixed === undefined);
                nextNotFixedCol.fixed = 'left';
            }
            // insert
            this.columns.splice(targetIndex, 0, sourceCol);
            console.log(this.columns, 'sd');
            // this.columns = [...this.columns];
        },
        addRow(num = 1, unshift) {
            const tmpIndex: Record<string, any>[] = [];
            for (let i = 0; i < num; i++) {
                const data = {
                    name: 'add' + this.addIndex,
                    age: Math.round(Math.random() * 100),
                    email: 'add@sa.com',
                    gender: Number(Math.random() * 100 - 50).toFixed(2),
                    address: '电力、热力、燃气',
                };
                if (unshift) {
                    this.dataSource.unshift(data);
                    // this.dataSource2.unshift(structuredClone(data));
                } else {
                    this.dataSource.push(data);
                    // this.dataSource2.push(structuredClone(data));
                }
                tmpIndex.push(data);
                this.addIndex++;
            }
            this.dataSource = [...this.dataSource]; // 没有监听deep
            // this.dataSource2 = [...this.dataSource2]; // 没有监听deep

            this.$nextTick(() => {
                const rowKeys = tmpIndex.map(it => it.name);
                this.$refs.stkTable.setHighlightDimRow(rowKeys);
                // this.$refs.stkTableC.setHighlightDimRow(rowKeys);
            });
        },
        addColumn(num = 1) {
            const temp: any[] = [];
            for (let i = 0; i < num; i++) {
                temp.push({
                    title: 'addCol',
                    dataIndex: 'addColumn' + (i + this.columns.length),
                    width: '100px',
                    minWidth: '100px',
                });
            }
            this.columns = this.columns.concat(temp);
        },
        deleteColumn(num = 1) {
            this.columns = this.columns.slice(0, -1 * num);
        },
    },
};
</script>

<style scoped>
.stk-table-parent {
    width: 700px;
    height: 400px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    .stk-table {
        flex: 1;
    }
}
</style>
