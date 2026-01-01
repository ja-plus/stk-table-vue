import type Dropdown from './index.vue';
import { createApp } from 'vue';
import './style.less';

let DropdownIns: InstanceType<typeof Dropdown> | null = null;

export async function getDropdownIns() {
    if (!DropdownIns) {
        const div = document.createElement('div');
        div.classList.add('stk-filter-dropdown-wrapper');
        document.body.appendChild(div);
        const Dropdown = await import('./index.vue').then(module => module.default);
        DropdownIns = createApp(Dropdown).mount(div) as InstanceType<typeof Dropdown>;
    }
    return DropdownIns;
}
