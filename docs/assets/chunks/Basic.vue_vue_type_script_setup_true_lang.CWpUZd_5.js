import{_ as n}from"./index.CjdUzutU.js";import{d as r,p as t,o as d,b as s}from"./framework.BnGeyzQu.js";const c=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../StkTable.vue';\r
import { StkTableColumn } from '../../src/StkTable/index';\r
\r
type Data = {\r
    name: string;\r
    age: number;\r
    address: string;\r
    gender: 'male' | 'female';\r
};\r
\r
const columns: StkTableColumn<Data>[] = [\r
    { type: 'seq', title: 'No.', dataIndex: '', width: 50 },\r
    { title: 'Name', dataIndex: 'name' },\r
    { title: 'Age', dataIndex: 'age', headerAlign: 'right', align: 'right' },\r
    { title: 'Gender', dataIndex: 'gender', align: 'center' },\r
    { title: 'Address', dataIndex: 'address' },\r
];\r
\r
const dataSource = ref<Data[]>([\r
    { name: \`Jack\`, age: 18, address: \`Beijing Forbidden City \`, gender: 'male' },\r
    { name: \`Tom\`, age: 20, address: \`Shanghai\`, gender: 'male' },\r
    { name: \`Lucy\`, age: 22, address: \`Guangzhou\`, gender: 'female' },\r
    { name: \`Lily\`, age: 24, address: \`Shenzhen\`, gender: 'female' },\r
]);\r
<\/script>\r
<template>\r
    <StkTable style="height: 200px" row-key="name" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,u=r({__name:"Basic",setup(l){const e=[{type:"seq",title:"No.",dataIndex:"",width:50},{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age",headerAlign:"right",align:"right"},{title:"Gender",dataIndex:"gender",align:"center"},{title:"Address",dataIndex:"address"}],a=t([{name:"Jack",age:18,address:"Beijing Forbidden City ",gender:"male"},{name:"Tom",age:20,address:"Shanghai",gender:"male"},{name:"Lucy",age:22,address:"Guangzhou",gender:"female"},{name:"Lily",age:24,address:"Shenzhen",gender:"female"}]);return(m,i)=>(d(),s(n,{style:{height:"200px"},"row-key":"name",columns:e,"data-source":a.value},null,8,["data-source"]))}});export{c as T,u as _};
