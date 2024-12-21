import{_ as h,A as f}from"./chunks/index.CjdUzutU.js";import{_ as s}from"./chunks/CheckItem.vue_vue_type_script_setup_true_lang.BWU_PY5e.js";import{d as w,p as l,o as m,c,G as e,F as k,a2 as g,w as d,k as i,B as C}from"./chunks/framework.BnGeyzQu.js";const x=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import CheckItem from '../components/CheckItem.vue';\r
\r
const virtual = ref(false);\r
const showOverflow = ref(true);\r
const showHeaderOverflow = ref(false);\r
\r
type DataType = {\r
    key: string;\r
    name: string;\r
    age: number;\r
    gender: string;\r
    corporation: string;\r
    address: string;\r
};\r
\r
const columns: StkTableColumn<DataType>[] = [\r
    { title: 'Name', dataIndex: 'name', width: 100 },\r
    { title: 'Age', dataIndex: 'age' },\r
    { title: 'Gender', dataIndex: 'gender' },\r
    { title: 'Corporation', dataIndex: 'corporation', maxWidth: 120 },\r
    { title: 'Address', dataIndex: 'address', maxWidth: 120 },\r
    { title: 'Long Title, LongTitle', dataIndex: 'address', maxWidth: 120 },\r
];\r
\r
const dataSource = ref<DataType[]>([\r
    {\r
        key: '1',\r
        name: 'John Brown',\r
        age: 32,\r
        gender: 'male',\r
        corporation: 'Netscape Communications Corporation',\r
        address: 'New York No. 1 Lake Park',\r
    },\r
    {\r
        key: '2',\r
        name: 'Jim Green',\r
        age: 42,\r
        gender: 'male',\r
        corporation: 'Netscape Communications Corporation',\r
        address: 'London No. 1 Lake Park',\r
    },\r
    {\r
        key: '3',\r
        name: 'Joe Black',\r
        age: 32,\r
        gender: 'male',\r
        corporation: 'Netscape Communications Corporation',\r
        address: 'Sidney No. 1 Lake Park',\r
    },\r
]);\r
<\/script>\r
<template>\r
    <CheckItem v-model="showOverflow" text="showOverflow"></CheckItem>\r
    <CheckItem v-model="showHeaderOverflow" text="showHeaderOverflow"></CheckItem>\r
    <CheckItem v-model="virtual" text="开启虚拟列表virtual"></CheckItem>\r
\r
    <StkTable\r
        row-key="key"\r
        :virtual="virtual"\r
        :show-overflow="showOverflow"\r
        :show-header-overflow="showHeaderOverflow"\r
        :columns="columns"\r
        :data-source="dataSource"\r
    ></StkTable>\r
</template>\r
`,b=w({__name:"Overflow",setup(u){const n=l(!1),r=l(!0),o=l(!1),p=[{title:"Name",dataIndex:"name",width:100},{title:"Age",dataIndex:"age"},{title:"Gender",dataIndex:"gender"},{title:"Corporation",dataIndex:"corporation",maxWidth:120},{title:"Address",dataIndex:"address",maxWidth:120},{title:"Long Title, LongTitle",dataIndex:"address",maxWidth:120}],v=l([{key:"1",name:"John Brown",age:32,gender:"male",corporation:"Netscape Communications Corporation",address:"New York No. 1 Lake Park"},{key:"2",name:"Jim Green",age:42,gender:"male",corporation:"Netscape Communications Corporation",address:"London No. 1 Lake Park"},{key:"3",name:"Joe Black",age:32,gender:"male",corporation:"Netscape Communications Corporation",address:"Sidney No. 1 Lake Park"}]);return(_,a)=>(m(),c(k,null,[e(s,{modelValue:r.value,"onUpdate:modelValue":a[0]||(a[0]=t=>r.value=t),text:"showOverflow"},null,8,["modelValue"]),e(s,{modelValue:o.value,"onUpdate:modelValue":a[1]||(a[1]=t=>o.value=t),text:"showHeaderOverflow"},null,8,["modelValue"]),e(s,{modelValue:n.value,"onUpdate:modelValue":a[2]||(a[2]=t=>n.value=t),text:"开启虚拟列表virtual"},null,8,["modelValue"]),e(h,{"row-key":"key",virtual:n.value,"show-overflow":r.value,"show-header-overflow":o.value,columns:p,"data-source":v.value},null,8,["virtual","show-overflow","show-header-overflow","data-source"])],64))}}),T=JSON.parse('{"title":"溢出内容省略","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/overflow.md","filePath":"table/basic/overflow.md","lastUpdated":1734792081000}'),y={name:"table/basic/overflow.md"},L=Object.assign(y,{setup(u){return(n,r)=>{const o=C("ClientOnly");return m(),c("div",null,[r[0]||(r[0]=g('<h1 id="溢出内容省略" tabindex="-1">溢出内容省略 <a class="header-anchor" href="#溢出内容省略" aria-label="Permalink to &quot;溢出内容省略&quot;">​</a></h1><h2 id="基本" tabindex="-1">基本 <a class="header-anchor" href="#基本" aria-label="Permalink to &quot;基本&quot;">​</a></h2><ul><li><code>props.showOverflow</code> 为 true，当内容溢出时，会显示省略号。</li><li><code>props.showHeaderOverflow</code> 为 true，当表头内容溢出时，会显示省略号。</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>开启虚拟列表时，为了不影响计算，将<strong>强制固定行高</strong>。</p></div>',4)),e(o,null,{default:d(()=>[e(i(f),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:i(x)},{vue:d(()=>[e(b)]),_:1},8,["vueCode"])]),_:1})])}}});export{T as __pageData,L as default};
