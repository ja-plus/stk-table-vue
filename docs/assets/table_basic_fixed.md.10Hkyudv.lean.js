import{_ as E,A as p}from"./chunks/index.CjdUzutU.js";import{d as g,p as r,o as h,b as u,c as y,G as a,F as f,a2 as m,w as n,k as l,j as d,a as c,B as w}from"./chunks/framework.BnGeyzQu.js";import{_ as F}from"./chunks/CheckItem.vue_vue_type_script_setup_true_lang.BWU_PY5e.js";const C=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
\r
const columns: StkTableColumn<any>[] = [\r
    { type: 'seq', title: 'No.', dataIndex: '', fixed: 'left', width: 50 },\r
    { title: 'Name', dataIndex: 'name', fixed: 'left', width: 100 },\r
    { title: 'Age', dataIndex: 'age', width: 100 },\r
    { title: 'Address', dataIndex: 'address', width: 200 },\r
    { title: 'Gender', dataIndex: 'gender', width: 70, fixed: 'left' },\r
    { title: 'Email', dataIndex: 'email', width: 200 },\r
    { title: 'Phone', dataIndex: 'phone', width: 100 },\r
    { title: 'Operation', dataIndex: 'operation', fixed: 'right', width: 100 },\r
    { title: 'Company', dataIndex: 'company', width: 200 },\r
    { title: 'Website', dataIndex: 'website', width: 100 },\r
];\r
const dataSource = ref([\r
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', gender: 'male', email: 'john@example.com' },\r
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', gender: 'male', email: 'jim@example.com' },\r
    { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', gender: 'male', email: 'joe@example.com' },\r
    { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park', gender: 'male', email: 'jim@example.com' },\r
    { key: '5', name: 'Jake White', age: 32, address: 'New York No. 2 Lake Park', gender: 'male', email: 'jake@example.com' },\r
    // 再加100条数据\r
    ...new Array(100).fill(0).map((_, i) => ({\r
        key: \`\${i + 6}\`,\r
        name: \`John Brown\${i + 6}\`,\r
        age: 32,\r
        address: 'New York No. 1 Lake Park',\r
        gender: 'male',\r
        email: 'john@example.com',\r
    })),\r
]);\r
<\/script>\r
\r
<template>\r
    <StkTable style="height: 200px" row-key="key" virtual virtual-x fixed-col-shadow :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,b=g({__name:"FixedVirtual",setup(k){const i=[{type:"seq",title:"No.",dataIndex:"",fixed:"left",width:50},{title:"Name",dataIndex:"name",fixed:"left",width:100},{title:"Age",dataIndex:"age",width:100},{title:"Address",dataIndex:"address",width:200},{title:"Gender",dataIndex:"gender",width:70,fixed:"left"},{title:"Email",dataIndex:"email",width:200},{title:"Phone",dataIndex:"phone",width:100},{title:"Operation",dataIndex:"operation",fixed:"right",width:100},{title:"Company",dataIndex:"company",width:200},{title:"Website",dataIndex:"website",width:100}],e=r([{key:"1",name:"John Brown",age:32,address:"New York No. 1 Lake Park",gender:"male",email:"john@example.com"},{key:"2",name:"Jim Green",age:42,address:"London No. 1 Lake Park",gender:"male",email:"jim@example.com"},{key:"3",name:"Joe Black",age:32,address:"Sidney No. 1 Lake Park",gender:"male",email:"joe@example.com"},{key:"4",name:"Jim Red",age:32,address:"London No. 2 Lake Park",gender:"male",email:"jim@example.com"},{key:"5",name:"Jake White",age:32,address:"New York No. 2 Lake Park",gender:"male",email:"jake@example.com"},...new Array(100).fill(0).map((s,t)=>({key:`${t+6}`,name:`John Brown${t+6}`,age:32,address:"New York No. 1 Lake Park",gender:"male",email:"john@example.com"}))]);return(s,t)=>(h(),u(E,{style:{height:"200px"},"row-key":"key",virtual:"","virtual-x":"","fixed-col-shadow":"",columns:i,"data-source":e.value},null,8,["data-source"]))}}),B=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import CheckItem from '../components/CheckItem.vue';\r
\r
const fixedColShadow = ref(false);\r
\r
const columns: StkTableColumn<any>[] = [\r
    { title: 'Name', dataIndex: 'name', fixed: 'left', width: 100 },\r
    { title: 'Age', dataIndex: 'age', width: 100 },\r
    { title: 'Address', dataIndex: 'address', width: 200 },\r
    { title: 'Gender', dataIndex: 'gender', width: 70, fixed: 'left' },\r
    { title: 'Email', dataIndex: 'email', width: 200 },\r
    { title: 'Phone', dataIndex: 'phone', width: 100 },\r
    { title: 'Company', dataIndex: 'company', width: 200 },\r
    { title: 'Operation', dataIndex: 'operation', fixed: 'right', width: 100 },\r
];\r
const dataSource = ref([\r
    { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', gender: 'male', email: 'john@example.com' },\r
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', gender: 'male', email: 'jim@example.com' },\r
    { key: '3', name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', gender: 'male', email: 'joe@example.com' },\r
    { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park', gender: 'male', email: 'jim@example.com' },\r
    { key: '5', name: 'Jake White', age: 32, address: 'New York No. 2 Lake Park', gender: 'male', email: 'jake@example.com' },\r
]);\r
<\/script>\r
\r
<template>\r
    <CheckItem v-model="fixedColShadow" text="show fixed shadow"></CheckItem>\r
    <StkTable :fixed-col-shadow="fixedColShadow" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,v=g({__name:"Fixed",setup(k){const i=r(!1),e=[{title:"Name",dataIndex:"name",fixed:"left",width:100},{title:"Age",dataIndex:"age",width:100},{title:"Address",dataIndex:"address",width:200},{title:"Gender",dataIndex:"gender",width:70,fixed:"left"},{title:"Email",dataIndex:"email",width:200},{title:"Phone",dataIndex:"phone",width:100},{title:"Company",dataIndex:"company",width:200},{title:"Operation",dataIndex:"operation",fixed:"right",width:100}],s=r([{key:"1",name:"John Brown",age:32,address:"New York No. 1 Lake Park",gender:"male",email:"john@example.com"},{key:"2",name:"Jim Green",age:42,address:"London No. 1 Lake Park",gender:"male",email:"jim@example.com"},{key:"3",name:"Joe Black",age:32,address:"Sidney No. 1 Lake Park",gender:"male",email:"joe@example.com"},{key:"4",name:"Jim Red",age:32,address:"London No. 2 Lake Park",gender:"male",email:"jim@example.com"},{key:"5",name:"Jake White",age:32,address:"New York No. 2 Lake Park",gender:"male",email:"jake@example.com"}]);return(t,o)=>(h(),y(f,null,[a(F,{modelValue:i.value,"onUpdate:modelValue":o[0]||(o[0]=x=>i.value=x),text:"show fixed shadow"},null,8,["modelValue"]),a(E,{"fixed-col-shadow":i.value,columns:e,"data-source":s.value},null,8,["fixed-col-shadow","data-source"])],64))}}),S=JSON.parse('{"title":"固定列","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/fixed.md","filePath":"table/basic/fixed.md","lastUpdated":1734768879000}'),I={name:"table/basic/fixed.md"},P=Object.assign(I,{setup(k){return(i,e)=>{const s=w("ClientOnly");return h(),y("div",null,[e[0]||(e[0]=m(`<h1 id="固定列" tabindex="-1">固定列 <a class="header-anchor" href="#固定列" aria-label="Permalink to &quot;固定列&quot;">​</a></h1><p>通过配置 <code>StkTableColumn[&#39;fixed&#39;] = &#39;left&#39;</code> 或 <code>&#39;right&#39;</code> 即可实现固定左侧或右侧列的效果。</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>由于表格使用了 <code>sticky</code> 实现固定列，因此支持<strong>列吸附</strong>的特性。</p></div><h2 id="基本" tabindex="-1">基本 <a class="header-anchor" href="#基本" aria-label="Permalink to &quot;基本&quot;">​</a></h2><p>列配置demo</p><div class="language-typescript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> columns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StkTableColumn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">any</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;[] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Name&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, dataIndex: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;name&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, fixed: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;left&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, width: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Age&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, dataIndex: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;age&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, width: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }, </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Address&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, dataIndex: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;address&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, width: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }, </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Gender 列前面的列都必须指定列宽</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Gender&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, dataIndex: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;gender&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, width: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, fixed: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;left&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Email&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, dataIndex: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;email&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Phone&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, dataIndex: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;phone&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Company&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, dataIndex: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;company&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Operation&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, dataIndex: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;operation&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, fixed: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;right&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, width: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>由于要用列宽来计算<strong>固定列</strong>的吸附位置，设置固定左侧列前面的所有列<strong>必须指定列宽</strong>。</p><p>如上表 <code>Gender</code> 列前的所有列必须都设置列宽。固定右侧同理。</p></div>`,7)),a(s,null,{default:n(()=>[a(l(p),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:l(B)},{vue:n(()=>[a(v)]),_:1},8,["vueCode"])]),_:1}),e[1]||(e[1]=m('<p>可以看到，上面表格横向滚动时， <code>Gender</code> 列会自动吸附到左侧。</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>如果您想要把所有的列都放在最左侧，请在 <code>columns</code> 中把固定左侧的列放在 <code>columns</code> 的最前面。同理固定右侧的列请全部放在 <code>columns</code> 的最后面。</p></div><h2 id="固定列阴影" tabindex="-1">固定列阴影 <a class="header-anchor" href="#固定列阴影" aria-label="Permalink to &quot;固定列阴影&quot;">​</a></h2><p>默认情况下，固定列没有阴影效果，如果您希望有阴影效果，可以设置 <code>fixed-col-shadow</code> 属性为 <code>true</code>。</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">StkTable</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> fixed-col-shadow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#B31D28;--shiki-light-font-style:italic;--shiki-dark:#FDAEB7;--shiki-dark-font-style:italic;">StkTable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h2 id="虚拟列表列固定" tabindex="-1">虚拟列表列固定 <a class="header-anchor" href="#虚拟列表列固定" aria-label="Permalink to &quot;虚拟列表列固定&quot;">​</a></h2>',6)),a(s,null,{default:n(()=>[a(l(p),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:l(C)},{vue:n(()=>[a(b)]),_:1},8,["vueCode"])]),_:1}),e[2]||(e[2]=d("div",{class:"warning custom-block"},[d("p",{class:"custom-block-title"},"WARNING"),d("p",null,[c("设置了 "),d("code",null,"props.virtual-x"),c(" 横向虚拟列表时，未设置列宽的列都会被强制设置为100px")])],-1))])}}});export{S as __pageData,P as default};
