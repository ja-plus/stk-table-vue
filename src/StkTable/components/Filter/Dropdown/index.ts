import { createApp } from 'vue';
import type Dropdown from './index.vue';

let DropdownIns: InstanceType<typeof Dropdown> | null = null;

export async function getDropdownIns() {
    if (!DropdownIns) {
        const div = document.createElement('div');
        div.classList.add('stk-filter-dropdown-wrapper');
        document.body.appendChild(div);

        const DropdownApp = await import('./index.vue').then(module => module.default);
        DropdownIns = createApp(DropdownApp).mount(div) as InstanceType<typeof DropdownApp>;
    }
    return DropdownIns;
}
