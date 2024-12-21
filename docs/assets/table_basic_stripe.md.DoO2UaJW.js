import{_ as m,A as c}from"./chunks/index.CjdUzutU.js";import{d as u,p,o,b as g,c as f,j as a,a as t,G as n,w as d,k as l,B as h}from"./chunks/framework.BnGeyzQu.js";const b=`<script lang="ts" setup>\r
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
const dataSource = ref([\r
    { name: \`Jack\`, age: 18, address: \`Beijing Forbidden City \`, gender: 'male' },\r
    { name: \`Tom\`, age: 20, address: \`Shanghai\`, gender: 'male' },\r
    { name: \`Lucy\`, age: 22, address: \`Guangzhou\`, gender: 'female' },\r
    { name: \`Lily\`, age: 24, address: \`Shenzhen\`, gender: 'female' },\r
]);\r
<\/script>\r
<template>\r
    <StkTable stripe :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,_=u({__name:"Stripe",setup(i){const r=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],e=p([{name:"Jack",age:18,address:"Beijing Forbidden City ",gender:"male"},{name:"Tom",age:20,address:"Shanghai",gender:"male"},{name:"Lucy",age:22,address:"Guangzhou",gender:"female"},{name:"Lily",age:24,address:"Shenzhen",gender:"female"}]);return(s,k)=>(o(),g(m,{stripe:"",columns:r,"data-source":e.value},null,8,["data-source"]))}}),v=JSON.parse('{"title":"斑马纹","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/stripe.md","filePath":"table/basic/stripe.md","lastUpdated":1734762449000}'),S={name:"table/basic/stripe.md"},B=Object.assign(S,{setup(i){return(r,e)=>{const s=h("ClientOnly");return o(),f("div",null,[e[0]||(e[0]=a("h1",{id:"斑马纹",tabindex:"-1"},[t("斑马纹 "),a("a",{class:"header-anchor",href:"#斑马纹","aria-label":'Permalink to "斑马纹"'},"​")],-1)),e[1]||(e[1]=a("p",null,[t("配置 "),a("code",null,"props.stripe"),t(" 属性可以开启斑马纹效果。")],-1)),n(s,null,{default:d(()=>[n(l(c),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:l(b)},{vue:d(()=>[n(_)]),_:1},8,["vueCode"])]),_:1})])}}});export{v as __pageData,B as default};
