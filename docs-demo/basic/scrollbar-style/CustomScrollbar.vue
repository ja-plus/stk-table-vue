<template>
    <div class="demo-container">
        <div class="demo-item">
            <h4>scrollbar</h4>
            <StkTable
                style="height: 200px"
                virtual
                scrollbar
                :columns="columns"
                :data-source="dataSource"
            ></StkTable>
        </div>
        <div class="demo-item">
            <h4>:scrollbar="{ width: 12, height: 12 }"</h4>
            <StkTable
                style="height: 200px"
                virtual
                :scrollbar="{ width: 12, height: 12 }"
                :columns="columns"
                :data-source="dataSource"
            ></StkTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StkTable from '../../StkTable.vue';

const generateData = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `用户${i + 1}`,
        age: Math.floor(Math.random() * 50) + 18,
        email: `user${i + 1}@example.com`,
        address: `北京市朝阳区建国路${Math.floor(Math.random() * 1000) + 1}号`,
        phone: `138${Math.floor(Math.random() * 100000000) + 100000000}`,
        company: `公司${i + 1}`,
        department: `部门${i + 1}`,
        position: `职位${i + 1}`,
        salary: Math.floor(Math.random() * 100000) + 50000,
    }));
};

const dataSource = ref(generateData(100));

const columns = ref([
    { dataIndex: 'id', title: 'ID', width: 80 },
    { dataIndex: 'name', title: '姓名', width: 120 },
    { dataIndex: 'age', title: '年龄', width: 80 },
    { dataIndex: 'email', title: '邮箱', width: 200 },
    { dataIndex: 'address', title: '地址', width: 250 },
    { dataIndex: 'phone', title: '电话', width: 150 },
    { dataIndex: 'company', title: '公司', width: 200 },
    { dataIndex: 'department', title: '部门', width: 150 },
    { dataIndex: 'position', title: '职位', width: 150 },
    { dataIndex: 'salary', title: '薪资', width: 120 },
    { dataIndex: 'id', title: 'ID', width: 80 },
    { dataIndex: 'name', title: '姓名', width: 120 },
    { dataIndex: 'age', title: '年龄', width: 80 },
    { dataIndex: 'email', title: '邮箱', width: 200 },
    { dataIndex: 'address', title: '地址', width: 250 },
    { dataIndex: 'phone', title: '电话', width: 150 },
]);
</script>

<style scoped>
.demo-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.demo-item {
    padding: 20px;
    border-radius: 8px;
}

.demo-item h4 {
    margin: 0 0 10px 0;
    font-size: 16px;
}
</style>
