/** 文件树数据：children 存在即为目录（可展开），否则是文件 */
export type FileTreeNode = {
    name: string;
    children?: FileTreeNode[];
};

/**
 * 初始数据即按名称字符串排序（localeCompare）——
 * 资源管理器里位置只由排序决定，新建 / 改名 / 移动后都会重新排一次。
 */
export const fileTreeData: FileTreeNode[] = [
    {
        name: 'docs-demo',
        children: [{ name: 'advanced' }, { name: 'basic' }],
    },
    { name: 'package.json' },
    { name: 'README.md' },
    {
        name: 'src',
        children: [
            {
                name: 'StkTable',
                children: [
                    {
                        name: 'components',
                        children: [{ name: 'SortIcon.vue' }, { name: 'TreeFoldIcon.vue' }, { name: 'TreeIndent.vue' }],
                    },
                    { name: 'index.ts' },
                    { name: 'StkTable.vue' },
                ],
            },
            { name: 'style.less' },
            { name: 'VirtualTree.vue' },
        ],
    },
];
