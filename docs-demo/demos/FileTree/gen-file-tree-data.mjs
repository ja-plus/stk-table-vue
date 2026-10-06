// 生成 fileTreeData.ts：按 stk-table-vue 仓库真实的（git 跟踪）目录结构构建文件树。
//
// 用法（在仓库任意位置执行均可）：
//   node docs-demo/demos/FileTree/gen-file-tree-data.mjs
//   # 或： pnpm gen:filetree
//
// 自动触发：已挂到 `pnpm docs:build` 前置步骤，每次构建文档站都会先刷新这份快照。
//
// 数据形状与 demo 约定一致：{ name, children? }，有 children 即目录（可展开），否则为文件。
// 排序复用 fileTreeStore 的资源管理器口径：文件夹优先，同类内按名称 localeCompare。
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(__dirname, 'fileTreeData.ts');

// 需要额外排除的顶层路径前缀（在 git 跟踪文件基础上再过滤，保持 demo 清爽）
const EXCLUDE_PREFIXES = [];
// 是否隐藏顶层点目录/点文件（.github、.qoder、.eslintrc.cjs 等工具元数据），只留项目真实源码结构
const HIDE_TOPLEVEL_DOTFILES = true;

/** 读取 git 跟踪的文件列表（POSIX 分隔） */
function listTrackedFiles(repoRoot) {
    return execFileSync('git', ['-c', 'core.quotepath=off', 'ls-files'], {
        cwd: repoRoot,
        encoding: 'utf8',
    })
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

/** 由扁平路径列表构建 { name, children? } 树 */
function buildTree(paths) {
    /** @type {FileTreeNode[]} */
    const roots = [];
    /** 目录索引：path -> 目录节点，便于复用同一目录、避免重复建节点 */
    const dirIndex = new Map();

    for (const p of paths) {
        const segments = p.split('/');
        let parentPath = '';
        let siblings = roots;
        for (let i = 0; i < segments.length; i++) {
            const name = segments[i];
            const isLast = i === segments.length - 1;
            const curPath = parentPath ? `${parentPath}/${name}` : name;
            if (isLast) {
                // 末段：文件（不带 children）
                siblings.push({ name });
            } else {
                // 中间段：目录，复用已建节点，避免重复
                let node = dirIndex.get(curPath);
                if (!node) {
                    node = { name, children: [] };
                    siblings.push(node);
                    dirIndex.set(curPath, node);
                }
                siblings = node.children;
            }
            parentPath = curPath;
        }
    }
    return roots;
}

/** 是否是目录（有 children 数组） */
function isFolder(node) {
    return Array.isArray(node.children);
}

/** 递归排序：文件夹优先，同类内按名称 localeCompare */
function sortTree(list) {
    list.sort((a, b) => {
        if (isFolder(a) !== isFolder(b)) return isFolder(a) ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
    for (const node of list) if (node.children) sortTree(node.children);
}

const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
}).trim();

const paths = listTrackedFiles(repoRoot).filter((p) => {
    if (EXCLUDE_PREFIXES.some((prefix) => p.startsWith(prefix))) return false;
    if (HIDE_TOPLEVEL_DOTFILES && p.startsWith('.')) return false;
    return true;
});

const tree = buildTree(paths);
sortTree(tree);

// 序列化为 TS 源码（4 空格缩进，与手写文件风格一致）
/** 输出单引号字符串（项目 prettier 口径），对反斜杠与单引号做转义 */
function tsString(value) {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}
function serialize(list, indentLevel = 1) {
    const pad = '    '.repeat(indentLevel);
    const lines = [];
    for (const node of list) {
        if (isFolder(node) && node.children.length) {
            lines.push(`${pad}{`);
            lines.push(`${pad}    name: ${tsString(node.name)},`);
            lines.push(`${pad}    children: [`);
            lines.push(serialize(node.children, indentLevel + 2).join('\n'));
            lines.push(`${pad}    ],`);
            lines.push(`${pad}},`);
        } else if (isFolder(node)) {
            // 空目录：仍需带 children 数组，否则表格不认为它可展开
            lines.push(`${pad}{ name: ${tsString(node.name)}, children: [] },`);
        } else {
            lines.push(`${pad}{ name: ${tsString(node.name)} },`);
        }
    }
    return lines;
}

const body = serialize(tree).join('\n');

const output = `/** 文件树数据：children 存在即为目录（可展开），否则为文件 */
export type FileTreeNode = {
    name: string;
    children?: FileTreeNode[];
};

/**
 * 初始数据即按「文件夹优先 + 名称 localeCompare」排好序——
 * 资源管理器里位置只由排序决定，新建 / 改名 / 移动后都会重新排一次。
 *
 * ⚠️ 本数组由脚本按仓库真实目录结构自动生成，请勿手改：
 *   node docs-demo/demos/FileTree/gen-file-tree-data.mjs
 */
export const fileTreeData: FileTreeNode[] = [
${body}
];
`;

// 用 prettier 按就近配置（docs-demo/.prettierrc.cjs）格式化后再写盘，保证与仓库风格一致
const config = (await prettier.resolveConfig(OUT_FILE)) ?? {};
const formatted = await prettier.format(output, { ...config, filepath: OUT_FILE });
writeFileSync(OUT_FILE, formatted, 'utf8');

/** 递归统计目录数 */
function countFolders(list) {
    return list.reduce((acc, node) => acc + (isFolder(node) ? 1 + countFolders(node.children) : 0), 0);
}
console.log(
    `✅ 已生成 ${OUT_FILE}（目录 ${countFolders(tree)} 个，共 ${paths.length} 个文件）`
);
