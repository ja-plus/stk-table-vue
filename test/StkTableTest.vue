<template>
    <div>
        <button @click="handleClearSorter">clearSorter</button>
        <button @click="handleClearTableData">clearTableData</button>
        <button @click="addRow()">pushRow</button>
        <button @click="addRow(100)">push100Row</button>
        <button @click="addRow(1, true)">unshiftRow</button>
        <button @click="addColumn()">addColumn</button>
        <button @click="deleteColumn()">deleteColumn</button>
        <button @click="startUnshiftRow">startUnshiftRow</button>
        <button @click="scrollAndDataToLess">less data when scroll bar in middle</button>
        <button @click="props.theme === 'light' ? (props.theme = 'dark') : (props.theme = 'light')">theme:{{ props.theme }}</button>
        <label><input v-model="props.showOverflow" type="checkbox" />showOverflow</label>
        <label><input v-model="props.showHeaderOverflow" type="checkbox" />showHeaderOverflow</label>
        <label><input v-model="props.sortRemote" type="checkbox" />sortRemote</label>
        <label><input v-model="props.headless" type="checkbox" />headless</label>
        <label><input v-model="props.colResizable" type="checkbox" />colResizable</label>
        <span> border: </span>
        <input v-model="props.bordered" type="radio" name="border" value="true" /> true
        <input v-model="props.bordered" type="radio" name="border" value="h" />horizontal
        <input v-model="props.bordered" type="radio" name="border" value="v" /> vertical
        <input v-model="props.bordered" type="radio" name="border" value="body-v" />body-vertical
        <label><input v-model="props.stripe" type="checkbox" />stripe</label>
        <label><input v-model="props.virtual" type="checkbox" />virtual</label>
        <label><input v-model="props.virtualX" type="checkbox" />virtualX</label>
        <label><input v-model="props.cellHover" type="checkbox" />cellHover</label>
        <label><input v-model="props.cellActive" type="checkbox" />cellActive</label>
        <label><input v-model="props.selectedCellRevokable" type="checkbox" />selectedCellRevokable</label>
        <label><input v-model="props.rowHover" type="checkbox" />rowHover</label>
        <label><input v-model="props.rowActive" type="checkbox" />rowActive</label>
        <label><input v-model="props.rowCurrentRevokable" type="checkbox" />rowCurrentRevokable</label>
        <label><input v-model="props.fixedColShadow" type="checkbox" />fixedColShadow</label>
        <label><input v-model="props.smoothScroll" type="checkbox" />smoothScroll</label>
    </div>
    <!-- <StkTableHugeData></StkTableHugeData> -->
    <div ref="stkTableParent" class="stk-table-parent">
        <StkTable
            v-bind="props"
            ref="stkTable"
            v-model:columns="columns"
            row-key="name"
            cell-fixed-mode="sticky"
            :seq-config="seqConfig"
            :row-height="28"
            :header-row-height="36"
            :hide-header-title="['age']"
            :empty-cell-text="({ col }) => (col.dataIndex === 'R' ? '/' : '--')"
            :auto-resize="() => console.log('auto-resize')"
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
            @cell-mouseover="onCellMouseOver"
            @cell-selected="onCellSelected"
        ></StkTable>
    </div>
    <!-- <div>
        columns:
        <div v-for="col in columns" :key="col.dataIndex">{{ col }}</div>
    </div> -->
    <StkTableSimple></StkTableSimple>
    <StkTableMultiHeader></StkTableMultiHeader>

    <ExpandRow></ExpandRow>

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

    <FixedMode></FixedMode>
    <StkTableInsertSort />

    <hr />
    <DocTable></DocTable>
</template>

<script lang="ts" setup>
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { StkTable, StkTableColumn } from '../src/StkTable/index';
// import { StkTable } from '../lib/stk-table-vue.js';
//import StkTableC from '../history/StkTableC/index.vue'; // 兼容版本 fixedLeft
import DocTable from './DocTable.vue';
import FixedMode from './FixedMode.vue';
import StkTableInsertSort from './StkTableInsertSort.vue'; // 插入排序
import StkTableMultiHeader from './StkTableMultiHeader.vue';
import StkTableSimple from './StkTableSimple.vue';
import DragResize from './utils/DragResize.js';
import ExpandRow from './ExpandRow.vue';
// import StkTableHugeData from './StkTableHugeData.vue';

const seqConfig = {
    startIndex: 20,
};
const props = ref({
    rowKey: 'name',
    theme: 'dark' as 'dark' | 'light',
    stripe: true,
    showOverflow: false,
    showHeaderOverflow: false,
    rowHover: true,
    rowActive: true,
    rowCurrentRevokable: true,
    cellHover: true,
    cellActive: false,
    selectedCellRevokable: true,
    sortRemote: false,
    // minWidth: 'auto',
    colResizable: true,
    headerDrag: col => col.dataIndex !== 'name',
    virtual: true,
    virtualX: true,
    noDataFull: true,
    headless: false,
    bordered: true,
    highlightConfig: {
        // fps: 10,
        duration: 1,
    },
    fixedColShadow: true,
    smoothScroll: false,
});

const dataSource = shallowRef<any>(
    [{}, null],
    // new Array(30).fill(0).map((it, i) => ({
    //     name: 'name' + i,
    //     age: Math.ceil(Math.random() * 100),
    //     email: 'add@sa.com',
    //     gender: Number(Math.random() * 100 - 50).toFixed(2),
    //     address: 'ahshshsshshhs',
    // })),
);

const isCheckAll = computed(() => dataSource.value.every(it => it?.isChecked));

const columns = shallowRef<StkTableColumn<any>[]>([
    {
        dataIndex: 'isChecked',
        align: 'center',
        fixed: 'left',
        width: 50,
        customHeaderCell: () => {
            return h('input', {
                type: 'checkbox',
                checked: isCheckAll.value,
                onChange: (e: any) => {
                    dataSource.value.forEach(it => it && (it.isChecked = e.target.checked));
                    dataSource.value = [...dataSource.value];
                },
            });
        },
        customCell: ({ row }) => {
            return h('input', {
                type: 'checkbox',
                checked: row?.isChecked,
                onChange: (e: any) => {
                    if (row) {
                        row.isChecked = e.target.checked;
                        dataSource.value = [...dataSource.value];
                    }
                },
            });
        },
    },
    {
        type: 'seq',
        dataIndex: 'seq',
        title: '序号',
        align: 'right',
        fixed: 'left',
        width: 50,
        // customCell: props => {
        //     return h('span', { style: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap' }, props.col.title + '(render) text-overflow,');
        // },
    },
    {
        title: 'Name',
        dataIndex: 'name',
        // fixed: 'left',
        width: 200,
        className: 'my-td',
        sorter: true,
        customHeaderCell: props => {
            return h('span', { style: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap' }, props.col.title + '(render) text-overflow,');
        },
        customCell: props => {
            return props.cellValue;
        },
    },
    {
        title: 'Age',
        dataIndex: 'age',
        fixed: 'left',
        headerClassName: 'my-th-orange',
        // width: 100, // 为确保横向滚动准确，列宽一定要固定，minWidth,maxWidth要相等
        sorter(data, { order, column }) {
            // console.log(data, order, column);
            if (order === 'desc') return data.sort((a, b) => b.age - a.age);
            else if (order === 'asc') return data.sort((a, b) => a.age - b.age);
            return data;
        },
        align: 'right',
        headerAlign: 'right',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        headerClassName: 'my-th-cyan',
        // fixed: 'right',
        width: 150,
        // minWidth: '150px',
        sorter: true,
        sortType: 'number', // 指定为数字排序
    },
    {
        title: 'Email(sortBy:name)',
        dataIndex: 'email',
        fixed: 'left',
        width: 150,
        sorter: true,
        sortField: 'name',
    },
    /** overflow 必须设置maxWidth */
    { title: 'Address', dataIndex: 'address', width: '100px' },
    { title: 'Address', dataIndex: 'address1', width: '100px' },
    { title: 'Address', dataIndex: 'address2', width: '100px' },
    { title: 'Address', dataIndex: 'address3', width: '100px' },
    {
        dataIndex: 'R',
        title: 'R',
        width: 50,
        fixed: 'right',
    },
    {
        dataIndex: 'R2',
        title: 'R2',
        width: 120,
    },
    {
        title: 'Operate',
        dataIndex: 'Operate',
        width: 150,
        fixed: 'right',
        // customCell() {
        //     return (
        //         <button>
        //             <a href="#">+add</a>
        //         </button>
        //     );
        // },
    },
]);

const stkTable = ref<InstanceType<typeof StkTable>>();
const stkTableParent = ref();

let intervals: number[] = [];
onMounted(() => {
    new DragResize(stkTableParent.value);
    const interval1 = window.setInterval(() => {
        stkTable.value?.setHighlightDimCell('1add', 'age');
    }, 2500);
    const interval2 = window.setInterval(() => {
        stkTable.value?.setHighlightDimCell('2add', 'gender');
    }, 1200);
    const interval3 = window.setInterval(() => {
        stkTable.value?.setHighlightDimRow(['0add']);
    }, 3000);
    const interval4 = window.setInterval(() => {
        stkTable.value?.setHighlightDimRow(['3add'], { method: 'css' });
    }, 1000);
    const interval5 = window.setInterval(() => {
        stkTable.value?.setHighlightDimRow(['5add'], { method: 'css', className: 'special-highlight-row', duration: 2000 });
    }, 1600);
    const interval6 = window.setInterval(() => {
        stkTable.value?.setHighlightDimCell('6add', 'name', { method: 'css', className: 'special-highlight-cell', duration: 1000 });
    }, 2300);
    const interval7 = window.setInterval(() => {
        stkTable.value?.setHighlightDimCell('7add', 'age', { method: 'css', className: 'special-highlight-cell-red', duration: 1500 });
    }, 2600);
    const interval8 = window.setInterval(() => {
        stkTable.value?.setHighlightDimCell('8add', 'name', {
            keyframe: {
                color: ['#fff', '#C70000', '#fff'],
                transform: ['scale(1)', 'scale(1.2)', 'scale(1)'],
                boxShadow: ['unset', '0 0 10px #aaa', 'unset'],
                easing: 'cubic-bezier(.11,.1,.03,.98)',
            },
            duration: 1000,
        });
    }, 1790);
    intervals.push(interval1, interval2, interval3, interval4, interval5, interval6, interval7, interval8);

    stkTable.value?.setSelectedCell({ name: '1add' }, columns.value[2]);
});

onBeforeUnmount(() => {
    intervals.forEach(n => {
        window.clearInterval(n);
    });
});

// function handleHeightInput(e) {
//     props.value.height = e.target.value + 'px';
//     nextTick(() => {
//         stkTable.value?.initVirtualScroll();
//     });
// }
function onCurrentChange(e, row, data) {
    console.log('current-change', e, row, data);
}
function onRowMenu(e, row) {
    console.log('row-menu:', e, row);
}
function onHeaderRowMenu(e) {
    console.log('header-row-menu:', e);
}
function onRowClick(e, row) {
    console.log('row-click:', e, row);
}
function onRowDblclick(e, row) {
    console.log('row-dblclick:', e, row);
}
function onCellClick(e, row, col) {
    // e.stopPropagation();
    console.log('cell-click:', e, row, col);
}
function onCellSelected(e, data) {
    console.log('cell-selected:', e, data);
}
function onHeaderCellClick(e, row) {
    console.log('header-cell-click:', e, row);
}
function onTableScroll(e, data) {
    const { startIndex, endIndex } = data;

    // window.clearTimeout(scrollTimeout);
    // scrollTimeout = window.setTimeout(() => {
    //     console.log(startIndex, endIndex);
    //     for (let i = startIndex; i < endIndex; i++) {
    //         const item = dataSource.value[i];
    //         if (!item.name) {
    //             dataSource.value[i] = {
    //                 name: 'name' + i,
    //             };
    //         }
    //     }
    //     dataSource.value = [...dataSource.value];
    // }, 200);
}
function handleClearSorter() {
    stkTable.value?.resetSorter();
}
function handleClearTableData() {
    dataSource.value = [];
}
function handleSortChange(col, order) {
    console.log('排序改变事件触发：', col, order);
}
function onColOrderChange(sourceKey, targetKey) {
    console.log(sourceKey, targetKey);
    const sourceIndex = columns.value.findIndex(it => it.dataIndex === sourceKey);
    const targetIndex = columns.value.findIndex(it => it.dataIndex === targetKey);
    // delete
    const deleteEle = columns.value.splice(sourceIndex, 1);
    // insert
    columns.value.splice(targetIndex, 0, deleteEle[0]);
    columns.value = [...columns.value];
}
// /** stkTableC列顺序变化 */
// function onColOrderChange2(sourceIndex, targetIndex) {
//     console.log(sourceIndex, targetIndex, 'sdf');
//     const targetCol = columns.value[targetIndex];
//     const sourceCol = columns.value.splice(sourceIndex, 1)[0];
//     // 非固定列移动到固定列
//     if (targetCol.fixed === 'left' && !sourceCol.fixed) {
//         sourceCol.fixed = 'left';
//         const nextNotFixedIndex = columns.value.findIndex(it => it.fixed === undefined);
//         delete columns.value[nextNotFixedIndex - 1].fixed;
//     } else if (sourceCol.fixed === 'left' && !targetCol.fixed) {
//         // 固定列移动到非固定列
//         delete sourceCol.fixed;
//         // 下一个固定列变为固定列
//         const nextNotFixedCol = columns.value.find(it => it.fixed === undefined);
//         nextNotFixedCol && (nextNotFixedCol.fixed = 'left');
//     }
//     // insert
//     columns.value.splice(targetIndex, 0, sourceCol);
// }
let addIndex = 0;
function addRow(num = 1, unshift = false) {
    const tmpIndex: Record<string, any>[] = [];
    for (let i = 0; i < num; i++) {
        const data = {
            name: addIndex + 'add',
            age: Math.round(Math.random() * 100),
            email: 'add@sa.com',
            gender: Number(Math.random() * 100 - 50).toFixed(2),
            address: '电力、热力、燃气',
            isChecked: Math.random() < 0.5,
        };
        if (unshift) {
            dataSource.value.unshift(data);
        } else {
            dataSource.value.push(data);
        }
        tmpIndex.push(data);
        addIndex++;
    }
    dataSource.value = [...dataSource.value]; // 没有监听deep

    nextTick(() => {
        const rowKeys = tmpIndex.map(it => it.name);
        if (num === 1) {
            if (unshift) {
                stkTable.value?.setHighlightDimRow(rowKeys, {
                    // method: 'css',
                    // keyframe: [
                    //     { backgroundColor: '#1e4c99', transform: 'rotateX(90deg)', opacity: 0, easing: 'ease-out' },
                    //     { backgroundColor: '#1B1B24', transform: 'rotateX(0)', opacity: 1, easing: 'ease-out' },
                    // ],
                    // duration: 300,
                });
            } else {
                stkTable.value?.setHighlightDimRow(rowKeys, {
                    method: 'animation',
                    keyframe: [
                        { backgroundColor: '#1e4c99', transform: 'translateX(200px)', opacity: 0, easing: 'cubic-bezier(.11,.1,.03,.98)' },
                        { backgroundColor: '#1B1B24', transform: 'translateX(0)', opacity: 1 },
                    ],
                    duration: 1000,
                });
            }
        } else {
            stkTable.value?.setHighlightDimRow(rowKeys);
        }
    });
}
function addColumn(num = 1) {
    const temp: any[] = [];
    for (let i = 0; i < num; i++) {
        temp.push({
            title: 'addCol',
            dataIndex: 'addColumn' + (i + columns.value.length),
            width: '100px',
            minWidth: '100px',
        });
    }
    columns.value = columns.value.concat(temp);
}
function deleteColumn(num = 1) {
    columns.value = columns.value.slice(0, -1 * num);
}

let unshiftRowInterval = 0;
function startUnshiftRow() {
    if (unshiftRowInterval) {
        window.clearInterval(unshiftRowInterval);
        unshiftRowInterval = 0;
        return;
    }
    unshiftRowInterval = window.setInterval(() => {
        addRow(1, true);
    }, 100);
}

function onCellMouseOver(e, row, col) {
    // console.log('onCellMouseOver', e, row, col.dataIndex);
}

function scrollAndDataToLess() {
    addRow(1000);
    window.setTimeout(() => {
        // scrollToBottom
        stkTable.value?.scrollTo(15000, 0);
        window.setTimeout(() => {
            // clearDataSource
            dataSource.value = [];
            // add 50 Row
            addRow(50);
        }, 500);
    }, 500);
}
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
@keyframes my-highlight-row {
    from {
        background-color: #bd7201;
    }
}
@keyframes my-highlight-cell {
    from {
        background-color: #5fa95f;
    }
}
@keyframes my-highlight-cell-red {
    from {
        background-color: #b14949;
    }
}
:deep(.special-highlight-row) {
    animation: my-highlight-row 2s linear;
}
:deep(.special-highlight-cell) {
    animation: my-highlight-cell 1s linear;
}
:deep(.special-highlight-cell-red) {
    animation: my-highlight-cell-red 1.5s linear;
}

:deep(.my-th-orange) {
    background-color: #d76110;
    color: #fff;
}
:deep(.my-th-cyan) {
    background-color: #1492ca;
    color: #fff;
}
</style>
