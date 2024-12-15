import{_ as t}from"./index.BpRgxyc2.js";import{d,p as s,o as l,b as o}from"./framework._dBDxwdZ.js";const u=`<script lang="ts" setup>\r
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
const dataSource = ref(\r
    new Array(3).fill(0).map((_, index) => {\r
        return {\r
            name: \`Jack \${index}\`,\r
            age: 18 + index,\r
            address: \`Beijing Forbidden City \${index}\`,\r
            gender: index % 2 === 0 ? 'male' : 'female',\r
        };\r
    }),\r
);\r
<\/script>\r
<template>\r
    <StkTable :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,p=d({__name:"Basic",setup(m){const n=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],a=s(new Array(3).fill(0).map((r,e)=>({name:`Jack ${e}`,age:18+e,address:`Beijing Forbidden City ${e}`,gender:e%2===0?"male":"female"})));return(r,e)=>(l(),o(t,{columns:n,"data-source":a.value},null,8,["data-source"]))}});export{u as T,p as _};
