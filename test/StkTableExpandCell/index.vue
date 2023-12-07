<template>
  <StkTable row-key="id" :columns="columns" :data-source="dataSource"></StkTable>
</template>
<script lang="jsx" setup>
import StkTable from '@/StkTable.vue';
import ExpandCell from './ExpandCell.jsx';
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: 'name',
    dataIndex: 'name',
    width: '200px',
    customCell: ExpandCell,
  },
];
const dataSource = [
  {
    id: 1,
    name: '伊朗自由纪念塔，气派雄伟，风格新颖，由西郊麦哈拉巴德国际机场驱车进入市区，首先映入眼帘的便是这座纪念塔。塔高45米，塔基长63米，宽42米，呈灰白色，采用钢筋水泥和大理石建成。自由纪念塔于1971年10月落成，伊朗建筑师候赛因·阿马那特在设计该塔过程中，既注意吸收外国建塔的优点，同时注意充分体现伊朗建筑的民族风格。塔的底层是博物馆和电影馆。',
  },
  {
    id: 2,
    name: '然而，机器学习行业的发展速度非常快，新技术和科学研究又定义了新产品和服务的构建方式。截止到 2022 年底，从机器学习工程师到创业公司创始人，每个人都在关注来年最有前景的发展趋势。如果你想了解明年最热门的一些趋势，不妨看看本文。',
  },
  {
    id: 3,
    name: '少量文字，少量文字，少量文字，',
  },
  {
    id: 4,
    name: '少量文字，少量文字，',
  },
];
</script>
