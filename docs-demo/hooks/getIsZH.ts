import { useData } from 'vitepress';

export function getIsZH(){
    const vpData = useData();
    return vpData.lang.value === 'zh'
}
