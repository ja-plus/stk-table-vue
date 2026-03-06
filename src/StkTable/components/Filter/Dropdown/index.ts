import { createApp } from 'vue';
import { FilterOption } from '../types';
import type Dropdown from './index.vue';

let DropdownIns: InstanceType<typeof Dropdown> | null = null;

export async function getDropdownIns(onConfirm: (values: FilterOption['value'][]) => void) {
    if (!DropdownIns) {
        const div = document.createElement('div');
        div.classList.add('stk-filter-dropdown-wrapper');
        document.body.appendChild(div);

        const DropdownApp = await import('./index.vue').then(module => module.default);
        DropdownIns = createApp(DropdownApp, {
            onConfirm,
        }).mount(div) as InstanceType<typeof DropdownApp>;
    }
    return DropdownIns;
}
