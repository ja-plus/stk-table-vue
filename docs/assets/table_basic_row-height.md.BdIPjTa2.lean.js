import{_ as g,S as c}from"./chunks/index.BJkAgK58.js";import{_ as k}from"./chunks/CheckItem.vue_vue_type_script_setup_true_lang.BWU_PY5e.js";import{d as u,p as i,o as d,c as o,G as a,F as E,a2 as b,w as r,k as l,j as v,B as y}from"./chunks/framework.BnGeyzQu.js";const f=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import CheckItem from '../components/CheckItem.vue';\r
\r
const virtual = ref(false);\r
\r
const columns: StkTableColumn<any>[] = [\r
    { title: 'Name', dataIndex: 'name' },\r
    { title: 'Age', dataIndex: 'age' },\r
    { title: 'Gender', dataIndex: 'gender' },\r
    { title: 'Address', dataIndex: 'address', maxWidth: 200 },\r
];\r
\r
const dataSource = ref([\r
    {\r
        name: \`Jack\`,\r
        age: 18,\r
        address: \`Beijing Forbidden City, \${' Long text'.repeat(20)}\`,\r
        gender: 'male',\r
    },\r
    { name: \`Tom\`, age: 20, address: \`Shanghai\`, gender: 'male' },\r
    { name: \`Lucy\`, age: 22, address: \`Guangzhou\`, gender: 'female' },\r
    { name: \`Lily\`, age: 24, address: \`Shenzhen\`, gender: 'female' },\r
    ...new Array(50).fill(0).map((_, i) => ({ name: \`Jack\${i}\`, age: 18, address: \`Beijing Forbidden City \`, gender: 'male' })),\r
]);\r
<\/script>\r
<template>\r
    <CheckItem v-model="virtual" text="开启虚拟列表virtual"></CheckItem>\r
    <StkTable style="height: 200px" :virtual="virtual" row-height="40" header-row-height="50" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,x=u({__name:"RowHeight",setup(h){const t=i(!1),e=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Gender",dataIndex:"gender"},{title:"Address",dataIndex:"address",maxWidth:200}],n=i([{name:"Jack",age:18,address:`Beijing Forbidden City, ${" Long text".repeat(20)}`,gender:"male"},{name:"Tom",age:20,address:"Shanghai",gender:"male"},{name:"Lucy",age:22,address:"Guangzhou",gender:"female"},{name:"Lily",age:24,address:"Shenzhen",gender:"female"},...new Array(50).fill(0).map((p,s)=>({name:`Jack${s}`,age:18,address:"Beijing Forbidden City ",gender:"male"}))]);return(p,s)=>(d(),o(E,null,[a(k,{modelValue:t.value,"onUpdate:modelValue":s[0]||(s[0]=m=>t.value=m),text:"开启虚拟列表virtual"},null,8,["modelValue"]),a(g,{style:{height:"200px"},virtual:t.value,"row-height":"40","header-row-height":"50",columns:e,"data-source":n.value},null,8,["virtual","data-source"])],64))}}),B=JSON.parse('{"title":"行高","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/row-height.md","filePath":"table/basic/row-height.md","lastUpdated":1734763687000}'),C={name:"table/basic/row-height.md"},F=Object.assign(C,{setup(h){return(t,e)=>{const n=y("ClientOnly");return d(),o("div",null,[e[0]||(e[0]=b(`<h1 id="行高" tabindex="-1">行高 <a class="header-anchor" href="#行高" aria-label="Permalink to &quot;行高&quot;">​</a></h1><p>通过配置 <code>props.rowHeight</code> 即可设置表体行高，默认为 30px。 通过配置 <code>props.headerRowHeight</code> 即可设置表头行高，默认为 30px。</p><h2 id="例子" tabindex="-1">例子 <a class="header-anchor" href="#例子" aria-label="Permalink to &quot;例子&quot;">​</a></h2><p>如下设置了表头行高为 50px，表体行高为 40px。</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">StkTable</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> row-height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;40&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> header-row-height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;50&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">StkTable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>在<strong>普通</strong>(非虚拟列表)模式下，若内容超过行高，则会撑开行高。</p><p>在<strong>虚拟列表</strong>的模式下，行高始终为设置的值。</p></div>`,6)),a(n,null,{default:r(()=>[a(l(c),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:l(f)},{vue:r(()=>[a(x)]),_:1},8,["vueCode"])]),_:1}),e[1]||(e[1]=v("p",null,"在开启虚拟列表时，滚动会导致列宽度变化，是没有设置列宽导致的。",-1))])}}});export{B as __pageData,F as default};
