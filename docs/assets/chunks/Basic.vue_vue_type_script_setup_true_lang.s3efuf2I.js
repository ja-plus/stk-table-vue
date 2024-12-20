import{_ as n}from"./index.BJkAgK58.js";import{d as r,p as d,o as t,b as s}from"./framework.BnGeyzQu.js";const g=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../StkTable.vue';\r
import { StkTableColumn } from '../../src/StkTable/index';\r
\r
const columns: StkTableColumn<any>[] = [\r
    { title: 'Name', dataIndex: 'name' },\r
    { title: 'Age', dataIndex: 'age' },\r
    { title: 'Address', dataIndex: 'address' },\r
    { title: 'Gender', dataIndex: 'gender' },\r
];\r
\r
const dataSource = ref([\r
    { name: \`Jack\`, age: 18, address: \`Beijing Forbidden City \`, gender: 'male' },\r
    { name: \`Tom\`, age: 20, address: \`Shanghai\`, gender: 'male' },\r
    { name: \`Lucy\`, age: 22, address: \`Guangzhou\`, gender: 'female' },\r
    { name: \`Lily\`, age: 24, address: \`Shenzhen\`, gender: 'female' },\r
]);\r
<\/script>\r
<template>\r
    <StkTable :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,u=r({__name:"Basic",setup(m){const e=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],a=d([{name:"Jack",age:18,address:"Beijing Forbidden City ",gender:"male"},{name:"Tom",age:20,address:"Shanghai",gender:"male"},{name:"Lucy",age:22,address:"Guangzhou",gender:"female"},{name:"Lily",age:24,address:"Shenzhen",gender:"female"}]);return(l,o)=>(t(),s(n,{columns:e,"data-source":a.value},null,8,["data-source"]))}});export{g as T,u as _};
