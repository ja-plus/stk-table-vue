import{_ as p,A as m}from"./chunks/index.CjdUzutU.js";import{d as u,u as x,o as i,c as f,j as e,k as n,p as b,b as h,w as d,G as l,a as r,a4 as _,a5 as k,F as g,B as T}from"./chunks/framework.BnGeyzQu.js";const D=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import NoData from '../../assets/svg-components/NoData.vue';\r
\r
const columns: StkTableColumn<any>[] = [\r
    { title: 'Name', dataIndex: 'name' },\r
    { title: 'Age', dataIndex: 'age' },\r
    { title: 'Address', dataIndex: 'address' },\r
    { title: 'Gender', dataIndex: 'gender' },\r
];\r
\r
const dataSource = ref([]);\r
<\/script>\r
<template>\r
    <StkTable :columns="columns" :data-source="dataSource">\r
        <template #empty>\r
            <div style="padding: 20px; display: flex; flex-direction: column; align-items: center">\r
                <NoData />\r
                <p>暂无数据，请通过 <a href="#" style="color: #1890ff">权限管理</a> 申请。</p>\r
            </div>\r
        </template>\r
    </StkTable>\r
</template>\r
`,y={t:"1731832660304",class:"icon",viewBox:"0 0 1647 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"1671","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"80",height:"80"},A=["fill"],S=["fill"],C=["fill"],B=["fill"],I=["fill"],w=u({__name:"NoData",setup(c){const{isDark:a}=x();return(t,o)=>(i(),f("svg",y,[e("path",{d:"M0 845.913043c0 98.348522 368.751304 178.086957 823.652174 178.086957s823.652174-79.738435 823.652174-178.086957-368.751304-178.086957-823.652174-178.086956-823.652174 79.738435-823.652174 178.086956z",fill:n(a)?"#888":"#f5f5f5","p-id":"1672"},null,8,A),e("path",{d:"M1402.434783 322.782609L1142.205217 31.833043C1129.71687 11.998609 1111.485217 0 1092.274087 0H532.769391c-19.21113 0-37.442783 11.998609-49.93113 31.788522L222.608696 322.80487V556.521739h1179.826087V322.782609z",fill:n(a)?"#aaa":"#fff","p-id":"1673"},null,8,S),e("path",{d:"M1092.274087 0c17.853217 0 34.816 10.351304 47.193043 27.692522l2.738087 4.140521L1402.434783 322.782609V556.521739H222.608696V322.80487L482.838261 31.788522c11.575652-18.387478 28.16-30.052174 45.83513-31.610435L532.769391 0h559.504696z m0 25.288348H532.769391c-8.43687 0-17.808696 5.476174-25.6 16.116869l-2.56 3.739826-2.537739 3.383653-253.818435 283.781565v198.92313h1128.537044V332.354783L1122.971826 48.573217l-2.56-3.383652c-7.43513-11.820522-16.695652-18.476522-25.288348-19.700869l-2.849391-0.200348z",fill:n(a)?"#bebebe":"#e0e0e0","p-id":"1674"},null,8,C),e("path",{d:"M1059.08313 408.041739c0-40.581565 25.488696-74.106435 57.121392-74.128696H1402.434783v458.796522c0 53.715478-33.836522 97.725217-75.664696 97.725218H298.295652C256.445217 890.434783 222.608696 846.402783 222.608696 792.709565V333.913043h286.230261c31.610435 0 57.121391 33.458087 57.121391 74.061914v0.556521c0 40.603826 25.778087 73.394087 57.388522 73.394087h378.345739c31.610435 0 57.388522-33.079652 57.388521-73.683478v-0.178087z",fill:n(a)?"#888":"#fafafa","p-id":"1675"},null,8,B),e("path",{d:"M508.838957 333.913043c30.430609 0 55.140174 30.942609 57.032347 69.409392l0.089044 5.209043c0 40.603826 25.778087 73.394087 57.388522 73.394087h378.345739c30.408348 0 55.429565-30.608696 57.277217-69.053217l0.111304-4.808348c0-40.603826 25.488696-74.128696 57.121392-74.150957H1402.434783v458.796522c0 53.715478-33.836522 97.725217-75.664696 97.725218H298.295652C256.445217 890.434783 222.608696 846.402783 222.608696 792.709565V333.913043h286.230261zM248.253217 792.709565c0 39.468522 22.327652 69.89913 46.948174 72.281044l3.072 0.155826H1326.747826c24.776348 0 48.083478-28.872348 49.90887-67.539478l0.111304-4.897392V359.201391H1116.204522c-14.692174 0-29.696 18.543304-31.321044 44.254609l-0.155826 4.608c0 51.778783-33.28 96.189217-78.491826 98.994087l-4.541217 0.155826H623.34887c-45.946435 0-80.717913-42.496-82.92174-93.540174l-0.111304-5.698782c0-26.490435-14.180174-46.436174-28.872348-48.573218l-2.604521-0.200348H248.253217V792.709565z",fill:n(a)?"#bebebe":"#e0e0e0","p-id":"1676"},null,8,I)]))}}),V={style:{padding:"20px",display:"flex","flex-direction":"column","align-items":"center"}},N=u({__name:"Slot",setup(c){const a=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],t=b([]);return(o,s)=>(i(),h(p,{columns:a,"data-source":t.value},{empty:d(()=>[e("div",V,[l(w),s[0]||(s[0]=e("p",null,[r("暂无数据，请通过 "),e("a",{href:"#",style:{color:"#1890ff"}},"权限管理"),r(" 申请。")],-1))])]),_:1},8,["data-source"]))}}),L=`<script lang="ts" setup>\r
import { ref } from 'vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import StkTable from '../../StkTable.vue';\r
\r
const columns: StkTableColumn<any>[] = [\r
    { title: 'Name', dataIndex: 'name' },\r
    { title: 'Age', dataIndex: 'age' },\r
    { title: 'Address', dataIndex: 'address' },\r
    { title: 'Gender', dataIndex: 'gender' },\r
];\r
const noDataFull = ref(true);\r
<\/script>\r
<template>\r
    <label>\r
        <input v-model="noDataFull" type="checkbox" />\r
        <span>no-data-full</span>\r
    </label>\r
    <StkTable style="height: 200px" :no-data-full="noDataFull" :columns="columns" :data-source="[]"></StkTable>\r
</template>\r
`,H=u({__name:"NoDataFull",setup(c){const a=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],t=b(!0);return(o,s)=>(i(),f(g,null,[e("label",null,[_(e("input",{"onUpdate:modelValue":s[0]||(s[0]=v=>t.value=v),type:"checkbox"},null,512),[[k,t.value]]),s[1]||(s[1]=e("span",null,"no-data-full",-1))]),l(p,{style:{height:"200px"},"no-data-full":t.value,columns:a,"data-source":[]},null,8,["no-data-full"])],64))}}),W=`<script lang="ts" setup>\r
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
const dataSource = ref([]);\r
<\/script>\r
<template>\r
    <StkTable :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,G=u({__name:"Default",setup(c){const a=[{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age"},{title:"Address",dataIndex:"address"},{title:"Gender",dataIndex:"gender"}],t=b([]);return(o,s)=>(i(),h(p,{columns:a,"data-source":t.value},null,8,["data-source"]))}}),F=JSON.parse('{"title":"空数据","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/empty.md","filePath":"table/basic/empty.md","lastUpdated":1734616288000}'),j={name:"table/basic/empty.md"},P=Object.assign(j,{setup(c){return(a,t)=>{const o=T("ClientOnly");return i(),f("div",null,[t[0]||(t[0]=e("h1",{id:"空数据",tabindex:"-1"},[r("空数据 "),e("a",{class:"header-anchor",href:"#空数据","aria-label":'Permalink to "空数据"'},"​")],-1)),t[1]||(t[1]=e("h2",{id:"默认",tabindex:"-1"},[r("默认 "),e("a",{class:"header-anchor",href:"#默认","aria-label":'Permalink to "默认"'},"​")],-1)),l(o,null,{default:d(()=>[l(n(m),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:n(W)},{vue:d(()=>[l(G)]),_:1},8,["vueCode"])]),_:1}),t[2]||(t[2]=e("h2",{id:"高度铺满表格-no-data-full",tabindex:"-1"},[r("高度铺满表格(no-data-full) "),e("a",{class:"header-anchor",href:"#高度铺满表格-no-data-full","aria-label":'Permalink to "高度铺满表格(no-data-full)"'},"​")],-1)),t[3]||(t[3]=e("div",{class:"tip custom-block"},[e("p",{class:"custom-block-title"},"TIP"),e("p",null,[r("通过配置 "),e("code",null,"no-data-full"),r(" 属性实现。")])],-1)),l(o,null,{default:d(()=>[l(n(m),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:n(L)},{vue:d(()=>[l(H)]),_:1},8,["vueCode"])]),_:1}),t[4]||(t[4]=e("h2",{id:"自定义内容插槽-empty",tabindex:"-1"},[r("自定义内容插槽(#empty) "),e("a",{class:"header-anchor",href:"#自定义内容插槽-empty","aria-label":'Permalink to "自定义内容插槽(#empty)"'},"​")],-1)),t[5]||(t[5]=e("p",null,[r("slot名称："),e("code",null,"empty")],-1)),t[6]||(t[6]=e("div",{class:"tip custom-block"},[e("p",{class:"custom-block-title"},"TIP"),e("p",null,[e("code",null,"i18n"),r("国际化也请通过插槽实现。")])],-1)),l(o,null,{default:d(()=>[l(n(m),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:n(D)},{vue:d(()=>[l(N)]),_:1},8,["vueCode"])]),_:1})])}}});export{F as __pageData,P as default};
