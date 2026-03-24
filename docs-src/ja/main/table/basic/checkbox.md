# チェックボックス
## 概要

StkTableコンポーネントには**組み込みのチェックボックス機能はありません**が、`customCell` と `customHeaderCell` 設定オプションを通じて実装できます。このアプローチは非常に柔軟で、異なるビジネス要件を満たすことができます。

## 例

<demo vue="basic/checkbox/Checkbox.vue" />


## コード実装

列設定にカスタム列を追加してチェックボックスを表示します：

```javascript
{
  customHeaderCell: () => {
    return h('span', [
        h('input', {
            type: 'checkbox',
            style: 'vertical-align:middle',
            checked: isCheckAll.value,
            indeterminate: isCheckPartial.value,
            onChange: (e: Event) => {
                const checked = (e.target as HTMLInputElement).checked;
                dataSource.value.forEach(item => {
                    item.isChecked = checked;
                });
            },
        }),
    ]);
  },
  customCell: ({ row }) => {
    return h('div', { style: 'display:flex;align-items:center;justify-content:center' }, [
        h('input', {
            type: 'checkbox',
            checked: row.isChecked,
            onChange: (e: Event) => {
                row.isChecked = (e.target as HTMLInputElement).checked;
            },
        }),
    ]);
  },
}
```

input要素を垂直方向の中央配置のために親要素でラップします。

プロジェクトのVueコンポーネントライブラリ（Element Plus、Ant Design Vue、Naive UIなど）から `Checkbox` コンポーネントに `input` を置き換えて、プロジェクト全体で一貫したスタイルを維持できます。
