import{_ as n,S as b}from"./chunks/index.DEDPM5Gz.js";import{d as m,p,o as c,c as u,j as r,G as d,F as f,_ as v,a2 as h,w as o,k as s,B as S}from"./chunks/framework.B0bGi2fO.js";const k=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
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
    <article>\r
        <header>bordered</header>\r
        <StkTable bordered :columns="columns" :data-source="dataSource"></StkTable>\r
    </article>\r
    <article>\r
        <header>bordered=false - 没有分割线</header>\r
        <StkTable :bordered="false" :columns="columns" :data-source="dataSource"></StkTable>\r
    </article>\r
    <article>\r
        <header>bordered="h"- 仅横线</header>\r
        <StkTable bordered="h" :columns="columns" :data-source="dataSource"></StkTable>\r
    </article>\r
    <article>\r
        <header>bordered="v" - 仅竖线</header>\r
        <StkTable bordered="v" :columns="columns" :data-source="dataSource"></StkTable>\r
    </article>\r
    <article>\r
        <header>bordered="body-v" - 表头横竖线，表体仅竖线</header>\r
        <StkTable bordered="body-v" :columns="columns" :data-source="dataSource"></StkTable>\r
    </article>\r
</template>\r
\r
<style scoped>\r
article {\r
    border: 1px solid var(--vp-c-border);\r
    border-radius: 5px;\r
    padding: 8px;\r
    margin-bottom: 8px;\r
}\r
.stk-table {\r
    /* height: 100px; */\r
}\r
</style>\r
`,x=m({__name:"Default",setup(i){const t=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],a=p(new Array(3).fill(0).map((l,e)=>({name:`Jack ${e}`,age:18+e,address:`Beijing Forbidden City ${e}`,gender:e%2===0?"male":"female"})));return(l,e)=>(c(),u(f,null,[r("article",null,[e[0]||(e[0]=r("header",null,"bordered",-1)),d(n,{bordered:"",columns:t,"data-source":a.value},null,8,["data-source"])]),r("article",null,[e[1]||(e[1]=r("header",null,"bordered=false - 没有分割线",-1)),d(n,{bordered:!1,columns:t,"data-source":a.value},null,8,["data-source"])]),r("article",null,[e[2]||(e[2]=r("header",null,'bordered="h"- 仅横线',-1)),d(n,{bordered:"h",columns:t,"data-source":a.value},null,8,["data-source"])]),r("article",null,[e[3]||(e[3]=r("header",null,'bordered="v" - 仅竖线',-1)),d(n,{bordered:"v",columns:t,"data-source":a.value},null,8,["data-source"])]),r("article",null,[e[4]||(e[4]=r("header",null,'bordered="body-v" - 表头横竖线，表体仅竖线',-1)),d(n,{bordered:"body-v",columns:t,"data-source":a.value},null,8,["data-source"])])],64))}}),g=v(x,[["__scopeId","data-v-094e64fd"]]),C=JSON.parse('{"title":"边框","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/bordered.md","filePath":"table/basic/bordered.md","lastUpdated":1731837048000}'),_={name:"table/basic/bordered.md"},B=Object.assign(_,{setup(i){return(t,a)=>{const l=S("ClientOnly");return c(),u("div",null,[a[0]||(a[0]=h('<h1 id="边框" tabindex="-1">边框 <a class="header-anchor" href="#边框" aria-label="Permalink to &quot;边框&quot;">​</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>配置 <code>bordered</code> 实现表格边框， 取值 <code>true</code> | <code>false</code> | <code>h</code> | <code>v</code> | <code>body-v</code>。</p><p>出于滚动条影响，表格右侧和底部的边框，由单元格的 <code>border-right</code> 和 <code>border-bottom</code> 实现。因此会消失。您可根据实际情况自行添加css。</p></div>',2)),d(l,null,{default:o(()=>[d(s(b),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:s(k)},{vue:o(()=>[d(g)]),_:1},8,["vueCode"])]),_:1})])}}});export{C as __pageData,B as default};
