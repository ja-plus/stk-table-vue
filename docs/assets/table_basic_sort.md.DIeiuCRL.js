import{_ as u,A as y}from"./chunks/index.CjdUzutU.js";import{d as g,p as E,o as d,b,c as B,j as r,a as p,G as s,w as l,k as o,a2 as A,B as f}from"./chunks/framework.BnGeyzQu.js";const F=`<script setup lang="ts">\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
import { Order, SortConfig } from '@/StkTable/types';\r
\r
type DataType = {\r
    key: string;\r
    name: string;\r
};\r
\r
const columns: StkTableColumn<DataType>[] = [\r
    { title: 'No.', dataIndex: '' as any, type: 'seq', width: 50 },\r
    { title: 'Name', dataIndex: 'name', sorter: true },\r
];\r
\r
const dataSource = ref<DataType[]>(\r
    Array.from({ length: 100 }, (_, i) => ({\r
        key: String(i),\r
        name: \`Name \${i}\`,\r
    })),\r
);\r
\r
async function handleSortChange(col: StkTableColumn<DataType>, order: Order, data: DataType[], sortType: SortConfig<DataType>) {\r
    // 模拟远程排序，实际应用中，这里应该调用接口，将排序参数传递给后端，后端返回排序后的数据\r
    const result = await new Promise<DataType[]>(resolve => {\r
        if (order === 'desc') {\r
            resolve([\r
                { key: '1', name: 'Name 1' },\r
                { key: '2', name: 'Name 2' },\r
            ]);\r
        } else if (order === 'asc') {\r
            resolve([\r
                { key: '3', name: 'Name 3' },\r
                { key: '2', name: 'Name 2' },\r
                { key: '1', name: 'Name 1' },\r
            ]);\r
        } else {\r
            resolve([\r
                { key: '1', name: 'Name 1' },\r
                { key: '3', name: 'Name 3' },\r
                { key: '2', name: 'Name 2' },\r
                { key: '4', name: 'Name 4' },\r
            ]);\r
        }\r
    });\r
    dataSource.value = result;\r
}\r
<\/script>\r
<template>\r
    <StkTable style="height: 200px" row-key="key" sort-remote :columns="columns" :data-source="dataSource" @sort-change="handleSortChange"></StkTable>\r
</template>\r
`,C=g({__name:"SortRemote",setup(k){const a=[{title:"No.",dataIndex:"",type:"seq",width:50},{title:"Name",dataIndex:"name",sorter:!0}],e=E(Array.from({length:100},(n,i)=>({key:String(i),name:`Name ${i}`})));async function t(n,i,c,T){const m=await new Promise(h=>{h(i==="desc"?[{key:"1",name:"Name 1"},{key:"2",name:"Name 2"}]:i==="asc"?[{key:"3",name:"Name 3"},{key:"2",name:"Name 2"},{key:"1",name:"Name 1"}]:[{key:"1",name:"Name 1"},{key:"3",name:"Name 3"},{key:"2",name:"Name 2"},{key:"4",name:"Name 4"}])});e.value=m}return(n,i)=>(d(),b(u,{style:{height:"200px"},"row-key":"key","sort-remote":"",columns:a,"data-source":e.value,onSortChange:t},null,8,["data-source"]))}}),S=`<script setup lang="ts">\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
\r
type DataType = {\r
    key: string;\r
    name: string;\r
    age: number | null;\r
};\r
\r
const columns: StkTableColumn<DataType>[] = [\r
    { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },\r
    { title: 'Name', dataIndex: 'name', sorter: true },\r
    { title: 'Age', dataIndex: 'age', align: 'right', sortType: 'number', sorter: true },\r
];\r
\r
const dataSource = ref<DataType[]>([\r
    { key: '1', name: 'John Brown', age: 365 },\r
    { key: '2', name: 'Tom', age: 60 },\r
    { key: '3', name: 'Jerry', age: 90 },\r
    { key: '4', name: 'Nicolas', age: null },\r
    { key: '5', name: 'Kitty', age: 730 },\r
]);\r
<\/script>\r
<template>\r
    <StkTable\r
        style="height: 200px"\r
        row-key="key"\r
        :sort-config="{\r
            emptyToBottom: true,\r
            defaultSort: {\r
                dataIndex: 'age',\r
                order: 'desc',\r
                sortType: 'number',\r
            },\r
        }"\r
        :columns="columns"\r
        :data-source="dataSource"\r
    ></StkTable>\r
</template>\r
`,v=g({__name:"DefaultSort",setup(k){const a=[{type:"seq",title:"No.",dataIndex:"",width:50},{title:"Name",dataIndex:"name",sorter:!0},{title:"Age",dataIndex:"age",align:"right",sortType:"number",sorter:!0}],e=E([{key:"1",name:"John Brown",age:365},{key:"2",name:"Tom",age:60},{key:"3",name:"Jerry",age:90},{key:"4",name:"Nicolas",age:null},{key:"5",name:"Kitty",age:730}]);return(t,n)=>(d(),b(u,{style:{height:"200px"},"row-key":"key","sort-config":{emptyToBottom:!0,defaultSort:{dataIndex:"age",order:"desc",sortType:"number"}},columns:a,"data-source":e.value},null,8,["data-source"]))}}),x=`<script setup lang="ts">\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
\r
type DataType = {\r
    key: string;\r
    name: string;\r
    age: number | null;\r
};\r
\r
const columns: StkTableColumn<DataType>[] = [\r
    { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },\r
    { title: 'Name', dataIndex: 'name' },\r
    { title: 'Age', dataIndex: 'age', align: 'right', sortType: 'number', sorter: true },\r
];\r
\r
const dataSource = ref<DataType[]>([\r
    { key: '1', name: 'John Brown', age: 365 },\r
    { key: '2', name: 'John Brown', age: 60 },\r
    { key: '3', name: 'John Brown', age: 90 },\r
    { key: '4', name: 'John Brown', age: null },\r
    { key: '5', name: 'John Brown', age: 730 },\r
]);\r
<\/script>\r
<template>\r
    <StkTable style="height: 200px" row-key="key" :sort-config="{ emptyToBottom: true }" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,N=g({__name:"SortEmptyValue",setup(k){const a=[{type:"seq",title:"No.",dataIndex:"",width:50},{title:"Name",dataIndex:"name"},{title:"Age",dataIndex:"age",align:"right",sortType:"number",sorter:!0}],e=E([{key:"1",name:"John Brown",age:365},{key:"2",name:"John Brown",age:60},{key:"3",name:"John Brown",age:90},{key:"4",name:"John Brown",age:null},{key:"5",name:"John Brown",age:730}]);return(t,n)=>(d(),b(u,{style:{height:"200px"},"row-key":"key","sort-config":{emptyToBottom:!0},columns:a,"data-source":e.value},null,8,["data-source"]))}}),w=`<script setup lang="ts">\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
\r
type DataType = {\r
    key: string;\r
    name: string;\r
    period: string;\r
    periodNumber: number;\r
};\r
\r
const columns: StkTableColumn<DataType>[] = [\r
    { type: 'seq', title: 'No.', dataIndex: '' as any, width: 50 },\r
    { title: 'Name', dataIndex: 'name' },\r
    { title: 'Period', dataIndex: 'period', align: 'right', sorter: true, sortField: 'periodNumber' },\r
    { title: 'PeriodNumber', dataIndex: 'periodNumber', align: 'right' },\r
];\r
\r
const dataSource = ref<DataType[]>([\r
    { key: '1', name: 'John Brown', period: '1Y', periodNumber: 365 },\r
    { key: '2', name: 'John Brown', period: '2M', periodNumber: 60 },\r
    { key: '3', name: 'John Brown', period: '3M', periodNumber: 90 },\r
    { key: '4', name: 'John Brown', period: '6M', periodNumber: 180 },\r
    { key: '5', name: 'John Brown', period: '2Y', periodNumber: 730 },\r
    { key: '6', name: 'John Brown', period: '2M', periodNumber: 60 },\r
    { key: '7', name: 'John Brown', period: '4M', periodNumber: 120 },\r
    { key: '8', name: 'John Brown', period: '49D', periodNumber: 49 },\r
    { key: '9', name: 'John Brown', period: '180D', periodNumber: 180 },\r
    { key: '10', name: 'John Brown', period: '1.5Y', periodNumber: 547 },\r
]);\r
<\/script>\r
<template>\r
    <StkTable style="height: 200px" row-key="key" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,_=g({__name:"SortField",setup(k){const a=[{type:"seq",title:"No.",dataIndex:"",width:50},{title:"Name",dataIndex:"name"},{title:"Period",dataIndex:"period",align:"right",sorter:!0,sortField:"periodNumber"},{title:"PeriodNumber",dataIndex:"periodNumber",align:"right"}],e=E([{key:"1",name:"John Brown",period:"1Y",periodNumber:365},{key:"2",name:"John Brown",period:"2M",periodNumber:60},{key:"3",name:"John Brown",period:"3M",periodNumber:90},{key:"4",name:"John Brown",period:"6M",periodNumber:180},{key:"5",name:"John Brown",period:"2Y",periodNumber:730},{key:"6",name:"John Brown",period:"2M",periodNumber:60},{key:"7",name:"John Brown",period:"4M",periodNumber:120},{key:"8",name:"John Brown",period:"49D",periodNumber:49},{key:"9",name:"John Brown",period:"180D",periodNumber:180},{key:"10",name:"John Brown",period:"1.5Y",periodNumber:547}]);return(t,n)=>(d(),b(u,{style:{height:"200px"},"row-key":"key",columns:a,"data-source":e.value},null,8,["data-source"]))}}),J=`<script setup lang="ts">\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
\r
type DataType = {\r
    key: string;\r
    name: string;\r
    rate: string;\r
};\r
\r
/** 用数组下表表示权重 */\r
const RATE_ARR = ['D', 'C', 'B-', 'B', 'B+', 'BB', 'BBB', 'A-', 'A', 'A+', 'AA', 'AA+', 'AAA'];\r
\r
/** 自定义排序函数 */\r
const customRateSorter: StkTableColumn<DataType>['sorter'] = (data, { column, order }) => {\r
    const key = column.dataIndex as keyof DataType;\r
    if (order === 'desc') {\r
        data.sort((a, b) => RATE_ARR.indexOf(b[key]) - RATE_ARR.indexOf(a[key]));\r
    } else if (order === 'asc') {\r
        data.sort((a, b) => RATE_ARR.indexOf(a[key]) - RATE_ARR.indexOf(b[key]));\r
    }\r
    return data;\r
};\r
\r
const columns: StkTableColumn<DataType>[] = [\r
    { title: 'No.', dataIndex: '' as any, type: 'seq', width: 50 },\r
    { title: 'Name', dataIndex: 'name', sorter: true },\r
    { title: 'Rate', dataIndex: 'rate', sorter: customRateSorter },\r
];\r
\r
const dataSource = ref<DataType[]>(\r
    Array.from({ length: 100 }, (_, i) => ({\r
        key: String(i),\r
        name: \`Name \${i}\`,\r
        rate: RATE_ARR[Math.floor(Math.random() * RATE_ARR.length)],\r
    })),\r
);\r
<\/script>\r
<template>\r
    <StkTable style="height: 200px" row-key="key" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,I=g({__name:"CustomSort",setup(k){const a=["D","C","B-","B","B+","BB","BBB","A-","A","A+","AA","AA+","AAA"],t=[{title:"No.",dataIndex:"",type:"seq",width:50},{title:"Name",dataIndex:"name",sorter:!0},{title:"Rate",dataIndex:"rate",sorter:(i,{column:c,order:T})=>{const m=c.dataIndex;return T==="desc"?i.sort((h,D)=>a.indexOf(D[m])-a.indexOf(h[m])):T==="asc"&&i.sort((h,D)=>a.indexOf(h[m])-a.indexOf(D[m])),i}}],n=E(Array.from({length:100},(i,c)=>({key:String(c),name:`Name ${c}`,rate:a[Math.floor(Math.random()*a.length)]})));return(i,c)=>(d(),b(u,{style:{height:"200px"},"row-key":"key",columns:t,"data-source":n.value},null,8,["data-source"]))}}),R=`<script setup lang="ts">\r
import { ref } from 'vue';\r
import StkTable from '../../StkTable.vue';\r
import { StkTableColumn } from '../../../src/StkTable/index';\r
\r
type DataType = {\r
    key: string;\r
    name: string;\r
    age: number;\r
    gender: string;\r
};\r
\r
const columns: StkTableColumn<DataType>[] = [\r
    { title: 'Name', dataIndex: 'name', width: 100, sorter: true },\r
    { title: 'Age', dataIndex: 'age', sorter: true },\r
    { title: 'Gender', dataIndex: 'gender', sorter: true },\r
];\r
\r
const dataSource = ref<DataType[]>(\r
    // 100 个假数据\r
    Array.from({ length: 100 }, (_, i) => ({\r
        key: i.toString(),\r
        name: \`Name \${i}\`,\r
        age: Math.round(Math.random() * 100),\r
        gender: i % 2 === 0 ? 'Male' : 'Female',\r
    })),\r
);\r
<\/script>\r
<template>\r
    <StkTable style="height: 200px" row-key="key" :columns="columns" :data-source="dataSource"></StkTable>\r
</template>\r
`,q=g({__name:"Sort",setup(k){const a=[{title:"Name",dataIndex:"name",width:100,sorter:!0},{title:"Age",dataIndex:"age",sorter:!0},{title:"Gender",dataIndex:"gender",sorter:!0}],e=E(Array.from({length:100},(t,n)=>({key:n.toString(),name:`Name ${n}`,age:Math.round(Math.random()*100),gender:n%2===0?"Male":"Female"})));return(t,n)=>(d(),b(u,{style:{height:"200px"},"row-key":"key",columns:a,"data-source":e.value},null,8,["data-source"]))}}),P=JSON.parse('{"title":"排序","description":"","frontmatter":{},"headers":[],"relativePath":"table/basic/sort.md","filePath":"table/basic/sort.md","lastUpdated":1734857201000}'),W={name:"table/basic/sort.md"},Z=Object.assign(W,{setup(k){return(a,e)=>{const t=f("ClientOnly");return d(),B("div",null,[e[0]||(e[0]=r("h1",{id:"排序",tabindex:"-1"},[p("排序 "),r("a",{class:"header-anchor",href:"#排序","aria-label":'Permalink to "排序"'},"​")],-1)),e[1]||(e[1]=r("h2",{id:"基础排序",tabindex:"-1"},[p("基础排序 "),r("a",{class:"header-anchor",href:"#基础排序","aria-label":'Permalink to "基础排序"'},"​")],-1)),e[2]||(e[2]=r("p",null,"点击表头即可触发排序。",-1)),s(t,null,{default:l(()=>[s(o(y),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:o(R)},{vue:l(()=>[s(q)]),_:1},8,["vueCode"])]),_:1}),e[3]||(e[3]=A('<h2 id="自定义排序" tabindex="-1">自定义排序 <a class="header-anchor" href="#自定义排序" aria-label="Permalink to &quot;自定义排序&quot;">​</a></h2><p>通过 <code>sorter(data, { column, order })</code> 自定义排序规则。</p><p>该函数会在排序时触发，表格将使用函数的<strong>返回值</strong>展示。</p><table tabindex="0"><thead><tr><th>参数</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td>data</td><td>DataType[]</td><td>表格的数据。</td></tr><tr><td>column</td><td>StkTableColumn</td><td>当前排序的列。</td></tr><tr><td>order</td><td><code>&#39;desc&#39;</code> | <code>&#39;asc&#39;</code> | <code>null</code></td><td>当前排序的顺序。</td></tr></tbody></table><p>下述表格中自定义了 <code>Rate</code> 列字段的大小排序规则。</p>',5)),s(t,null,{default:l(()=>[s(o(y),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:o(J)},{vue:l(()=>[s(I)]),_:1},8,["vueCode"])]),_:1}),e[4]||(e[4]=r("h2",{id:"sortfield-排序字段",tabindex:"-1"},[p("sortField 排序字段 "),r("a",{class:"header-anchor",href:"#sortfield-排序字段","aria-label":'Permalink to "sortField 排序字段"'},"​")],-1)),e[5]||(e[5]=r("p",null,[p("有些字段可能会使用独立的字段来排序，比如年、月、日字段，此时可提供的一个排序专用字段，年、月都转换为最小单位日，便于排序，此时通过 "),r("code",null,"sortField"),p(" 指定该排序字段。")],-1)),e[6]||(e[6]=r("p",null,[p("下面表格 "),r("code",null,"period"),p(" 列指定了 "),r("code",null,"periodNumber"),p(" 作为排序字段。")],-1)),s(t,null,{default:l(()=>[s(o(y),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:o(w)},{vue:l(()=>[s(_)]),_:1},8,["vueCode"])]),_:1}),e[7]||(e[7]=A('<h2 id="空字段不参与排序" tabindex="-1">空字段不参与排序 <a class="header-anchor" href="#空字段不参与排序" aria-label="Permalink to &quot;空字段不参与排序&quot;">​</a></h2><p>配置 <code>props.sortConfig.emptyToBottom</code> 空字段将始终置于列表底部</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">StkTable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sort-config</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{emptyToBottom: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">StkTable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div>',3)),s(t,null,{default:l(()=>[s(o(y),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:o(x)},{vue:l(()=>[s(N)]),_:1},8,["vueCode"])]),_:1}),e[8]||(e[8]=A('<h2 id="指定默认排序列" tabindex="-1">指定默认排序列 <a class="header-anchor" href="#指定默认排序列" aria-label="Permalink to &quot;指定默认排序列&quot;">​</a></h2><p>配置 <code>props.sortConfig.defaultSort</code> 控制默认排序。</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>设置了默认排序时，如果<strong>没有排序</strong>则会排序<strong>默认排序</strong>字段。</p><p>点击下方表格 <code>Name</code> 列排序观察其行为。</p></div>',3)),s(t,null,{default:l(()=>[s(o(y),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:o(S)},{vue:l(()=>[s(v)]),_:1},8,["vueCode"])]),_:1}),e[9]||(e[9]=A('<h2 id="服务端排序" tabindex="-1">服务端排序 <a class="header-anchor" href="#服务端排序" aria-label="Permalink to &quot;服务端排序&quot;">​</a></h2><p>配置 <code>props.sort-remote</code> 为 <code>true</code>，这样就不会触发组件内部的排序逻辑。</p><p>点击表头后，会触发 <code>@sort-change</code> 事件，您可以在事件中发起 ajax 请求，然后重新对 <code>props.dataSource</code> 赋值，完成排序。</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">StkTable</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> sort-remote</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">StkTable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div>',4)),s(t,null,{default:l(()=>[s(o(y),{title:"",description:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",visible:!0,vueCode:o(F)},{vue:l(()=>[s(C)]),_:1},8,["vueCode"])]),_:1}),e[10]||(e[10]=A(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="stktablecolumn列配置" tabindex="-1">StkTableColumn列配置 <a class="header-anchor" href="#stktablecolumn列配置" aria-label="Permalink to &quot;StkTableColumn列配置&quot;">​</a></h3><p><code>StkTableColumn</code> 列配置参数。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> columns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StkTableColumn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    sorter: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    sortField: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;xxx&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    sortType: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;number&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}]</span></span></code></pre></div><table tabindex="0"><thead><tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td>sorter</td><td><code>boolean</code> | <code>((data: T[], option: { order: Order; column: any }) =&gt; T[])</code></td><td><code>false</code></td><td>指定是否开启排序。</td></tr><tr><td>sortField</td><td><code>string</code></td><td>同 StkTableColumn[&#39;dataIndex&#39;]</td><td>指定排序的字段。</td></tr><tr><td>sortType</td><td><code>&#39;string&#39;</code> | <code>&#39;number&#39;</code></td><td>默认检测该列第一行的数据类型，判断 <code>&#39;string&#39;</code> 或 <code>&#39;number&#39;</code> 排序。</td><td>指定排序的类型。</td></tr></tbody></table><h3 id="props-sortconfig" tabindex="-1">props.sortConfig <a class="header-anchor" href="#props-sortconfig" aria-label="Permalink to &quot;props.sortConfig&quot;">​</a></h3><p>SortConfig 类型：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SortConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Record</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">any</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&gt; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /** 空值始终排在列表末尾 */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    emptyToBottom</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * 默认排序（1.初始化时触发 2.排序方向为null时触发)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * 类似onMounted时，调用setSorter点了下表头。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    defaultSort</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         * 列唯一键，</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         * 如果您配了 \`props.colKey\` 则这里表示的列唯一键的值</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">         */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        key</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StkTableColumn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;key&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        dataIndex</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StkTableColumn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;dataIndex&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        order</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Order</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        sortField</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StkTableColumn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;sortField&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        sortType</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StkTableColumn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;sortType&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        sorter</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> StkTableColumn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;sorter&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">];</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        /** 是否禁止触发sort-change事件。默认false，表示触发事件。 */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        silent</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    };</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * string sort if use \`String.prototype.localCompare\`</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     * default: false</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">     */</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    stringLocaleCompare</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h3 id="sort-change" tabindex="-1">@sort-change <a class="header-anchor" href="#sort-change" aria-label="Permalink to &quot;@sort-change&quot;">​</a></h3><p>defineEmits 类型：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * 排序变更触发。defaultSort.dataIndex 找不到时，col 将返回null。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> *</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> * \`\`\`(col: StkTableColumn&lt;DT&gt; | null, order: Order, data: DT[], sortConfig: SortConfig&lt;DT&gt;)\`\`\`</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    e: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;sort-change&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /** 排序的列 */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    col: StkTableColumn</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /** 正序/倒序 */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    order: Order,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    /** 排序后的值 */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    data: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[], </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    sortConfig: SortConfig</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DT</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">): </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div>`,11))])}}});export{P as __pageData,Z as default};
