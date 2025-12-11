<script lang="ts" setup>
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';
import { StkTableColumn } from '../../../src/StkTable/index';
import CheckItem from '../../components/CheckItem.vue';
import { useI18n } from '../../hooks/useI18n/index';

const { t } = useI18n();

const virtual = ref(false);
const showOverflow = ref(true);
const showHeaderOverflow = ref(false);

type DataType = {
    key: string;
    name: string;
    age: number;
    gender: string;
    corporation: string;
    address: string;
};

const columns: StkTableColumn<DataType>[] = [
    { title: t('name'), dataIndex: 'name', width: 100 },
    { title: t('age'), dataIndex: 'age' },
    { title: t('gender'), dataIndex: 'gender' },
    { title: t('corporation'), dataIndex: 'corporation', maxWidth: 120 },
    { title: t('address'), dataIndex: 'address', maxWidth: 120 },
    { title: t('longTitle'), dataIndex: 'address', maxWidth: 120 },
];

const dataSource = ref<DataType[]>([
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        gender: 'male',
        corporation: 'Netscape Communications Corporation',
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        gender: 'male',
        corporation: 'Netscape Communications Corporation',
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        gender: 'male',
        corporation: 'Netscape Communications Corporation',
        address: 'Sidney No. 1 Lake Park',
    },
]);
</script>
<template>
    <CheckItem v-model="showOverflow" text="showOverflow"></CheckItem>
    <CheckItem v-model="showHeaderOverflow" text="showHeaderOverflow"></CheckItem>
    <CheckItem v-model="virtual" text="开启虚拟列表virtual"></CheckItem>

    <StkTable
        row-key="key"
        :virtual="virtual"
        :show-overflow="showOverflow"
        :show-header-overflow="showHeaderOverflow"
        :columns="columns"
        :data-source="dataSource"
    ></StkTable>
</template>
