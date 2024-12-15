import{_ as b,S as f}from"./chunks/index.BpRgxyc2.js";import{d as k,u as I,p as u,o as g,c as x,j as t,a as l,t as h,G as r,n as S,k as o,N as _,F as y,_ as A,a2 as C,w as c,B as w}from"./chunks/framework._dBDxwdZ.js";const D=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import { useData } from 'vitepress';\r
const { isDark } = useData();\r
\r
const height = ref(150);\r
\r
const columns: StkTableColumn<any>[] = [\r
    { title: 'Name', dataIndex: 'name' },\r
    { title: 'Age', dataIndex: 'age' },\r
    { title: 'Address', dataIndex: 'address' },\r
    { title: 'Gender', dataIndex: 'gender' },\r
];\r
\r
const dataSource = ref(\r
    new Array(20).fill(0).map((_, index) => {\r
        return {\r
            name: \`Jack \${index}\`,\r
            age: 18 + index,\r
            address: \`Beijing Forbidden City \${index}\`,\r
            gender: index % 2 === 0 ? 'male' : 'female',\r
        };\r
    }),\r
);\r
\r
function handleHeightInput(e) {\r
    height.value = e.target.value;\r
}\r
<\/script>\r
<template>\r
    <div><input :value="height" type="range" min="100" max="800" @input="handleHeightInput" />{{ height }}px</div>\r
    <article :class="{ dark: isDark }" :style="{ height: height + 'px' }">\r
        <header>Flex Content</header>\r
        <StkTable :columns="columns" :data-source="dataSource"></StkTable>\r
    </article>\r
</template>\r
\r
<style scoped>\r
article {\r
    display: flex;\r
    flex-direction: column;\r
    border: 1px solid var(--coot-demo-box-border);\r
}\r
\r
header {\r
    min-height: 30px;\r
    background: var(--coot-demo-box-border);\r
    display: flex;\r
    align-items: center;\r
    padding: 0 12px;\r
    font-weight: bold;\r
}\r
\r
.stk-table {\r
    flex: 1;\r
    height: 0;\r
}\r
</style>\r
`,B=["value"],T=k({__name:"Flex",setup(v){const{isDark:i}=I(),e=u(150),d=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],p=u(new Array(20).fill(0).map((s,n)=>({name:`Jack ${n}`,age:18+n,address:`Beijing Forbidden City ${n}`,gender:n%2===0?"male":"female"})));function m(s){e.value=s.target.value}return(s,n)=>(g(),x(y,null,[t("div",null,[t("input",{value:e.value,type:"range",min:"100",max:"800",onInput:m},null,40,B),l(h(e.value)+"px",1)]),t("article",{class:S({dark:o(i)}),style:_({height:e.value+"px"})},[n[0]||(n[0]=t("header",null,"Flex Content",-1)),r(b,{columns:d,"data-source":p.value},null,8,["data-source"])],6)],64))}}),N=A(T,[["__scopeId","data-v-cfb37234"]]),j=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
\r
const width = ref(400);\r
const height = ref(150);\r
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
\r
function handleWidthInput(e) {\r
    width.value = e.target.value;\r
}\r
function handleHeightInput(e) {\r
    height.value = e.target.value;\r
}\r
<\/script>\r
<template>\r
    <div>width:<input :value="width" type="range" min="100" max="800" @input="handleWidthInput" />{{ width }}px</div>\r
    <div>height:<input :value="height" type="range" min="100" max="800" @input="handleHeightInput" />{{ height }}px</div>\r
    <StkTable :style="{ width: width + 'px', height: height + 'px' }" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,W=["value"],$=["value"],F=k({__name:"Default",setup(v){const i=u(400),e=u(150),d=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],p=u(new Array(3).fill(0).map((n,a)=>({name:`Jack ${a}`,age:18+a,address:`Beijing Forbidden City ${a}`,gender:a%2===0?"male":"female"})));function m(n){i.value=n.target.value}function s(n){e.value=n.target.value}return(n,a)=>(g(),x(y,null,[t("div",null,[a[0]||(a[0]=l("width:")),t("input",{value:i.value,type:"range",min:"100",max:"800",onInput:m},null,40,W),l(h(i.value)+"px",1)]),t("div",null,[a[1]||(a[1]=l("height:")),t("input",{value:e.value,type:"range",min:"100",max:"800",onInput:s},null,40,$),l(h(e.value)+"px",1)]),r(b,{style:_({width:i.value+"px",height:e.value+"px"}),columns:d,"data-source":p.value},null,8,["style","data-source"])],64))}}),G=JSON.parse('{"title":"宽高","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/size.md","filePath":"table/basic/size.md","lastUpdated":1731833881000}'),J={name:"table/basic/size.md"},L=Object.assign(J,{setup(v){return(i,e)=>{const d=w("ClientOnly");return g(),x("div",null,[e[0]||(e[0]=C('<h1 id="宽高" tabindex="-1">宽高 <a class="header-anchor" href="#宽高" aria-label="Permalink to &quot;宽高&quot;">​</a></h1><p>表格的宽高由根容器的宽高决定。</p><p>因此，您可以将表格放置在<code>flex</code>容器中，由<code>flex</code>管理高度，而不用手动设置宽高。</p><h2 id="固定宽高" tabindex="-1">固定宽高 <a class="header-anchor" href="#固定宽高" aria-label="Permalink to &quot;固定宽高&quot;">​</a></h2><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>通过 <code>style</code> 控制表格宽度高度。</p></div>',5)),r(d,null,{default:c(()=>[r(o(f),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:o(j)},{vue:c(()=>[r(F)]),_:1},8,["vueCode"])]),_:1}),e[1]||(e[1]=t("h2",{id:"flex-布局",tabindex:"-1"},[l("Flex 布局 "),t("a",{class:"header-anchor",href:"#flex-布局","aria-label":'Permalink to "Flex 布局"'},"​")],-1)),e[2]||(e[2]=t("div",{class:"tip custom-block"},[t("p",{class:"custom-block-title"},"TIP"),t("p",null,[l("控制外层 "),t("code",null,"flex"),l(" 弹性盒的高度，表格高度自适应。")])],-1)),r(d,null,{default:c(()=>[r(o(f),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:o(D)},{vue:c(()=>[r(N)]),_:1},8,["vueCode"])]),_:1})])}}});export{G as __pageData,L as default};
