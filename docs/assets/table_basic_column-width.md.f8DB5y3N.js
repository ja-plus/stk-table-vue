import{_ as g,S as p}from"./chunks/index.BJkAgK58.js";import{_ as b}from"./chunks/CheckItem.vue_vue_type_script_setup_true_lang.BWU_PY5e.js";import{d as f,p as o,o as c,c as u,G as a,F as v,a2 as m,w as d,k as l,B as x}from"./chunks/framework.BnGeyzQu.js";const k=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import CheckItem from '../components/CheckItem.vue';\r
\r
const virtual = ref(false);\r
\r
const columns: StkTableColumn<any>[] = [\r
    { type: 'seq', title: 'No.', dataIndex: '', fixed: 'left', width: 50 },\r
    { title: 'Name', dataIndex: 'name', width: 100 },\r
    { title: 'Age', dataIndex: 'age' },\r
    { title: 'Gender', dataIndex: 'gender' },\r
    { title: 'Address', dataIndex: 'address', maxWidth: 200 },\r
];\r
\r
const dataSource = ref([\r
    {\r
        name: \`Jack\`,\r
        age: 18,\r
        address: \`Beijing Forbidden City, \${' Long text'.repeat(5)}\`,\r
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
    <StkTable style="height: 200px" min-width="unset" :virtual="virtual" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,C=f({__name:"TableWidthFit",setup(h){const n=o(!1),e=[{type:"seq",title:"No.",dataIndex:"",fixed:"left",width:50},{title:"Name",dataIndex:"name",width:100},{title:"Age",dataIndex:"age"},{title:"Gender",dataIndex:"gender"},{title:"Address",dataIndex:"address",maxWidth:200}],r=o([{name:"Jack",age:18,address:`Beijing Forbidden City, ${" Long text".repeat(5)}`,gender:"male"},{name:"Tom",age:20,address:"Shanghai",gender:"male"},{name:"Lucy",age:22,address:"Guangzhou",gender:"female"},{name:"Lily",age:24,address:"Shenzhen",gender:"female"},...new Array(50).fill(0).map((i,t)=>({name:`Jack${t}`,age:18,address:"Beijing Forbidden City ",gender:"male"}))]);return(i,t)=>(c(),u(v,null,[a(b,{modelValue:n.value,"onUpdate:modelValue":t[0]||(t[0]=s=>n.value=s),text:"开启虚拟列表virtual"},null,8,["modelValue"]),a(g,{style:{height:"200px"},"min-width":"unset",virtual:n.value,columns:e,"data-source":r.value},null,8,["virtual","data-source"])],64))}}),S=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import CheckItem from '../components/CheckItem.vue';\r
\r
const virtual = ref(false);\r
\r
const columns: StkTableColumn<any>[] = [\r
    { title: 'Name', dataIndex: 'name', width: 100 },\r
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
    <StkTable style="height: 200px" :virtual="virtual" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,y=f({__name:"ColumnWidth",setup(h){const n=o(!1),e=[{title:"Name",dataIndex:"name",width:100},{title:"Age",dataIndex:"age"},{title:"Gender",dataIndex:"gender"},{title:"Address",dataIndex:"address",maxWidth:200}],r=o([{name:"Jack",age:18,address:`Beijing Forbidden City, ${" Long text".repeat(20)}`,gender:"male"},{name:"Tom",age:20,address:"Shanghai",gender:"male"},{name:"Lucy",age:22,address:"Guangzhou",gender:"female"},{name:"Lily",age:24,address:"Shenzhen",gender:"female"},...new Array(50).fill(0).map((i,t)=>({name:`Jack${t}`,age:18,address:"Beijing Forbidden City ",gender:"male"}))]);return(i,t)=>(c(),u(v,null,[a(b,{modelValue:n.value,"onUpdate:modelValue":t[0]||(t[0]=s=>n.value=s),text:"开启虚拟列表virtual"},null,8,["modelValue"]),a(g,{style:{height:"200px"},virtual:n.value,columns:e,"data-source":r.value},null,8,["virtual","data-source"])],64))}}),W=JSON.parse('{"title":"列宽","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/column-width.md","filePath":"table/basic/column-width.md","lastUpdated":1734768879000}'),_={name:"table/basic/column-width.md"},A=Object.assign(_,{setup(h){return(n,e)=>{const r=x("ClientOnly");return c(),u("div",null,[e[0]||(e[0]=m('<h1 id="列宽" tabindex="-1">列宽 <a class="header-anchor" href="#列宽" aria-label="Permalink to &quot;列宽&quot;">​</a></h1><h2 id="基础" tabindex="-1">基础 <a class="header-anchor" href="#基础" aria-label="Permalink to &quot;基础&quot;">​</a></h2><p>通过</p><ul><li><code>StkTableColumn[&#39;width&#39;]</code> : <code>number|string</code></li><li><code>StkTableColumn[&#39;minWidth&#39;]</code> : <code>number|string</code></li><li><code>StkTableColumn[&#39;maxWidth&#39;]</code> : <code>number|string</code></li></ul><p>设置列宽行为，传 <code>number</code> 类型时，单位是px。</p><p>也支持字符串自行指定单位，如<code>%</code>,<code>em</code>,<code>ch</code>等（<strong>虚拟列表只支持px</strong>）。</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>配置了 <code>StkTableColumn[&#39;width&#39;]</code> 就会同时配置 <code>StkTableColumn[&#39;minWidth&#39;]</code> 和 <code>StkTableColumn[&#39;maxWidth&#39;]</code>。</p></div>',7)),a(r,null,{default:d(()=>[a(l(p),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:l(S)},{vue:d(()=>[a(y)]),_:1},8,["vueCode"])]),_:1}),e[1]||(e[1]=m('<h2 id="表格不铺满" tabindex="-1">表格不铺满 <a class="header-anchor" href="#表格不铺满" aria-label="Permalink to &quot;表格不铺满&quot;">​</a></h2><p>组件中的表格默认 <code>min-width=100%</code>，会铺满整个容器。因此如果 <code>所有列宽总和</code> &lt; <code>容器宽度</code> 时，会根据配置列宽的比例自动调整列宽，使表格铺满整个容器。（这也是原生表格的默认行为）</p><p>如果希望不铺满，可以设置 <code>StkTable[&#39;minWidth&#39;]</code> 为 <code>unset</code>。</p>',3)),a(r,null,{default:d(()=>[a(l(p),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:l(k)},{vue:d(()=>[a(C)]),_:1},8,["vueCode"])]),_:1}),e[2]||(e[2]=m('<h2 id="横向虚拟列表" tabindex="-1">横向虚拟列表 <a class="header-anchor" href="#横向虚拟列表" aria-label="Permalink to &quot;横向虚拟列表&quot;">​</a></h2><p>在普通(非虚拟列表)模式与虚拟列表模式下的列宽控制行为有所不同。</p><p>在开启 <code>props.virtual-x</code>（横向虚拟列表）的情况下，<strong>必须</strong>要设置列宽用于计算。</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>不设置列宽会将每一列的宽度设置为<code>100</code></p></div><h2 id="固定列相关问题" tabindex="-1">固定列相关问题 <a class="header-anchor" href="#固定列相关问题" aria-label="Permalink to &quot;固定列相关问题&quot;">​</a></h2><p>如果您发现固定列的位置有问题，请检查是否设置列宽。具体移步<a href="/stk-table-vue/table/basic/fixed.html">固定列</a></p>',6))])}}});export{W as __pageData,A as default};
