/**
 * fileTreeStore.test.ts / fileTreeDemo.test.ts 专用的固定最小目录树。
 *
 * ⚠️ 为什么不直接用生产的 fileTreeData：
 * 生产数据 `docs-demo/demos/FileTree/fileTreeData.ts` 由 gen-file-tree-data.mjs 以
 * `git ls-files` 扫描真实仓库目录生成，内容随仓库文件增删而变，且含多个同名的
 * index.ts / README.md。测试若直接断言它，`byName('index.ts')` 之类会命中遍历序里的
 * 第一个同名节点，随目录漂移而失败。故测试统一改用这份受控 fixture，只验证 store 的
 * 排序 / 移动 / 粘贴 / 删除 / 拖拽等逻辑，与真实目录彻底解耦。
 * 此结构即 demo 数据脚本化（bc5d8012）之前手写的那份，全部断言都基于它。
 *
 * 形状与生产一致：{ name, children? }，children 存在即为目录（可展开），否则为文件。
 * 注意 docs-demo 下的 advanced / basic 无 children，按“文件”参与排序（文件夹优先）。
 * 初始已按「文件夹优先 + 名称 localeCompare」排好序。
 */
import type { FileTreeNode } from '../docs-demo/demos/FileTree/fileTreeData';

export type { FileTreeNode };

export const fileTreeData: FileTreeNode[] = [
    {
        name: 'docs-demo',
        children: [{ name: 'advanced' }, { name: 'basic' }],
    },
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
    { name: 'package.json' },
    { name: 'README.md' },
];
