<script setup lang="ts">
import StkTable from '../../../StkTable.vue';
import { StkTableColumn } from '../../../../src/StkTable/index';
import type { DataType } from './types';
import Panel from './Panel.vue';
import { Random } from 'mockjs';

const columns: StkTableColumn<DataType>[] = [{ dataIndex: 'title', title: '', customCell: Panel }];
const data = [
    {
        id: 'a',
        title: '特朗普：赞成TikTok继续在美国运营一段时间',
        content:
            '当地时间12月22日，美国当选总统特朗普在亚利桑那州首府菲尼克斯发表讲话时表示，他赞成TikTok在美国继续运营一段时间。这是特朗普迄今为止反对TikTok退出美国市场最强烈的信号之一。特朗普表示，在参加总统竞选期间，他在TikTok上发布的视频获得了数十亿的浏览量。',
        date: '2024年12月23日 07:51',
    },
    ...new Array(20).fill(0).map((_, i) => ({
        id: i,
        title: Random.csentence(5, 15),
        content: Random.cparagraph(1, 10),
        date: Random.datetime('yyyy-MM-dd HH:mm'),
    })),
];
</script>

<template>
    <StkTable
        row-key="id"
        style="height: 400px"
        virtual
        headless
        :row-height="200"
        :row-active="false"
        :bordered="false"
        :row-hover="false"
        :columns="columns"
        :data-source="data"
    ></StkTable>
</template>
<style scoped>
:deep(.v-head) {
    background-color: #333;
    font-weight: bold;
}
</style>
