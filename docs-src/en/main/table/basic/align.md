# Alignment

Configuration
| Property | Type | Default | Description |
| --- | --- | --- | --- |
| align | `"left"`\|`"center"`\|`"right"` | 'left' | Table body alignment |
| headerAlign | `"left"`\|`"center"`\|`"right"` | 'center' | Table header alignment |

```ts
const columns:StkTableColumn<any>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'center', // [!code ++]
    headerAlign: 'center', // [!code ++]
  },
]
```

<demo vue="basic/align/Align.vue"></demo>
