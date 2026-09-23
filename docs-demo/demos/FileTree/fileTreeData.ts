/** 文件树数据：children 存在即为目录（可展开），否则是文件 */
export type FileTreeNode = {
    name: string;
    children?: FileTreeNode[];
};

export const fileTreeData: FileTreeNode[] = [
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
                    { name: 'StkTable.vue' },
                    { name: 'index.ts' },
                ],
            },
            { name: 'VirtualTree.vue' },
            { name: 'style.less' },
        ],
    },
    {
        name: 'docs-demo',
        children: [{ name: 'basic' }, { name: 'advanced' }],
    },
    { name: 'package.json' },
    { name: 'README.md' },
];
