# Data Binding and Reactive Architecture

<cite>
**Referenced Files in This Document**
- [StkTable.vue](file://src/StkTable/StkTable.vue)
- [types/index.ts](file://src/StkTable/types/index.ts)
- [useVirtualScroll.ts](file://src/StkTable/useVirtualScroll.ts)
- [utils/index.ts](file://src/StkTable/utils/index.ts)
- [const.ts](file://src/StkTable/const.ts)
- [utils/constRefUtils.ts](file://src/StkTable/utils/constRefUtils.ts)
- [useTree.ts](file://src/StkTable/useTree.ts)
- [useRowExpand.ts](file://src/StkTable/useRowExpand.ts)
- [useCellSelection.ts](file://src/StkTable/useCellSelection.ts)
- [useAreaSelection.ts](file://src/StkTable/features/useAreaSelection.ts)
- [utils/useTriggerRef.ts](file://src/StkTable/utils/useTriggerRef.ts)
- [mockData.ts](file://docs-demo/demos/HugeData/mockData.ts)
- [key.md](file://docs-src/main/table/basic/key.md)
</cite>

## Update Summary
**Changes Made**
- Updated Data Source Prop and Transformation section to document enhanced empty data source handling
- Added new subsection covering automatic selection clearing behavior
- Updated Troubleshooting Guide with guidance for empty data scenarios
- Enhanced section sources to include the new empty data handling logic

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document explains Stk Table Vue's data binding patterns and reactive architecture with a focus on:
- The dataSource prop structure and how it is transformed into internal state
- Row key generation strategies and caching
- Data transformation processes for virtual scrolling and tree/expand features
- How reactivity propagates across props, internal state, and computed properties
- Immutability patterns, shallow reactive references, and performance trade-offs
- Virtual scrolling calculations, data copying strategies, and reference management
- Practical examples of different data binding approaches and best practices for large datasets
- **Enhanced empty data source handling to prevent inconsistent UI states**

## Project Structure
At the heart of the component is a single-file Vue 3 component that orchestrates multiple composable modules:
- StkTable.vue: central orchestration, props, watchers, computed, and template bindings
- useVirtualScroll.ts: virtualization engine for Y/X axes, slicing, offsets, and auto-height
- useTree.ts and useRowExpand.ts: data flattening and expansion toggling
- useCellSelection.ts: selection state and keyboard/mouse handlers
- useAreaSelection.ts: area selection state management with automatic clearing
- utils/index.ts: sorting helpers and shared utilities
- types/index.ts: TypeScript interfaces and type guards
- const.ts and utils/constRefUtils.ts: constants and column width helpers
- utils/useTriggerRef.ts: a small helper to trigger shallowRef updates

```mermaid
graph TB
STK["StkTable.vue"]
VIRT["useVirtualScroll.ts"]
TREE["useTree.ts"]
ROWEXP["useRowExpand.ts"]
CELLSEL["useCellSelection.ts"]
AREASEL["useAreaSelection.ts"]
UTILS["utils/index.ts"]
TYPES["types/index.ts"]
CONST["const.ts"]
CREF["utils/constRefUtils.ts"]
TRIG["utils/useTriggerRef.ts"]
STK --> VIRT
STK --> TREE
STK --> ROWEXP
STK --> CELLSEL
STK --> AREASEL
STK --> UTILS
STK --> TYPES
STK --> CONST
STK --> CREF
STK --> TRIG
```

**Diagram sources**
- [StkTable.vue:209-922](file://src/StkTable/StkTable.vue#L209-L922)
- [useVirtualScroll.ts:60-498](file://src/StkTable/useVirtualScroll.ts#L60-L498)
- [useTree.ts:12-161](file://src/StkTable/useTree.ts#L12-L161)
- [useRowExpand.ts:11-88](file://src/StkTable/useRowExpand.ts#L11-L88)
- [useCellSelection.ts:42-456](file://src/StkTable/useCellSelection.ts#L42-L456)
- [useAreaSelection.ts:13-781](file://src/StkTable/features/useAreaSelection.ts#L13-L781)
- [utils/index.ts:154-208](file://src/StkTable/utils/index.ts#L154-L208)
- [types/index.ts:54-120](file://src/StkTable/types/index.ts#L54-L120)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [utils/constRefUtils.ts:1-30](file://src/StkTable/utils/constRefUtils.ts#L1-L30)
- [utils/useTriggerRef.ts:15-33](file://src/StkTable/utils/useTriggerRef.ts#L15-L33)

**Section sources**
- [StkTable.vue:209-922](file://src/StkTable/StkTable.vue#L209-L922)
- [useVirtualScroll.ts:60-498](file://src/StkTable/useVirtualScroll.ts#L60-L498)
- [useTree.ts:12-161](file://src/StkTable/useTree.ts#L12-L161)
- [useRowExpand.ts:11-88](file://src/StkTable/useRowExpand.ts#L11-L88)
- [useCellSelection.ts:42-456](file://src/StkTable/useCellSelection.ts#L42-L456)
- [useAreaSelection.ts:13-781](file://src/StkTable/features/useAreaSelection.ts#L13-L781)
- [utils/index.ts:154-208](file://src/StkTable/utils/index.ts#L154-L208)
- [types/index.ts:54-120](file://src/StkTable/types/index.ts#L54-L120)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [utils/constRefUtils.ts:1-30](file://src/StkTable/utils/constRefUtils.ts#L1-L30)
- [utils/useTriggerRef.ts:15-33](file://src/StkTable/utils/useTriggerRef.ts#L15-L33)

## Core Components
- DataSource lifecycle: props.dataSource is shallow-copied into a shallowRef dataSourceCopy during initialization and whenever props.dataSource changes. Tree data is flattened before virtualization.
- **Enhanced empty data handling: When dataSource becomes empty, the component automatically clears the selected area to prevent inconsistent UI states.**
- Virtual scrolling: computed slices of visible rows and columns are derived from scroll positions and container sizes. Offsets and totals are recomputed reactively.
- Key generators: rowKeyGen caches computed keys in a WeakMap; colKeyGen is a computed factory based on props.colKey; cellKeyGen combines row and col keys.
- Sorting: tableSort produces a new array via slicing and sorting; in remote mode, the component emits events and expects external updates.
- Selection and interactions: cell selection range is tracked via refs and computed sets; row and cell selection state is updated reactively.

**Updated** Added automatic selection clearing behavior for empty data sources

**Section sources**
- [StkTable.vue:896-931](file://src/StkTable/StkTable.vue#L896-L931)
- [StkTable.vue:1035-1059](file://src/StkTable/StkTable.vue#L1035-L1059)
- [StkTable.vue:1062-1088](file://src/StkTable/StkTable.vue#L1062-L1088)
- [StkTable.vue:1070-1073](file://src/StkTable/StkTable.vue#L1070-L1073)
- [useVirtualScroll.ts:104-125](file://src/StkTable/useVirtualScroll.ts#L104-L125)
- [useVirtualScroll.ts:134-176](file://src/StkTable/useVirtualScroll.ts#L134-L176)
- [utils/index.ts:154-208](file://src/StkTable/utils/index.ts#L154-L208)

## Architecture Overview
The component's reactive pipeline connects props to internal state and computed views:

```mermaid
sequenceDiagram
participant P as "Parent"
participant S as "StkTable.vue"
participant DS as "dataSourceCopy (ShallowRef)"
participant VS as "VirtualScroll"
participant AS as "AreaSelection"
participant R as "Reactive Views"
P->>S : "props.dataSource changed"
S->>S : "initDataSource(val)"
S->>DS : "dataSourceCopy = val.slice()"
alt "isTreeData"
S->>DS : "flatTreeData(dataSourceCopy)"
end
S->>VS : "updateMaxRowSpan()"
S->>VS : "initVirtualScrollY() (nextTick)"
alt "dataSource is empty"
S->>AS : "clearSelectedArea()"
end
S->>R : "virtual_dataSourcePart computed"
R-->>P : "render visible rows"
```

**Diagram sources**
- [StkTable.vue:896-931](file://src/StkTable/StkTable.vue#L896-L931)
- [StkTable.vue:1035-1059](file://src/StkTable/StkTable.vue#L1035-L1059)
- [StkTable.vue:1070-1073](file://src/StkTable/StkTable.vue#L1070-L1073)
- [useVirtualScroll.ts:205-229](file://src/StkTable/useVirtualScroll.ts#L205-L229)
- [useAreaSelection.ts:762-766](file://src/StkTable/features/useAreaSelection.ts#L762-L766)

## Detailed Component Analysis

### Data Source Prop and Transformation
- Initialization: props.dataSource is shallow-copied to dataSourceCopy. If tree columns exist, data is flattened to a linear structure for virtualization.
- Updates: watcher on props.dataSource triggers initDataSource and recomputes virtualization and row spans. If length changes, Y virtualization is reinitialized after rendering.
- **Enhanced empty data handling: When the incoming dataSource is empty (length === 0), the component automatically calls clearSelectedArea() to prevent inconsistent UI states where selections might persist after data clearing.**
- Remote sorting: when sortRemote is true, sorting is skipped internally; the component emits events and expects the parent to update dataSource.

```mermaid
flowchart TD
Start(["props.dataSource change"]) --> Init["initDataSource(val)"]
Init --> IsTree{"isTreeData?"}
IsTree --> |Yes| Flat["flatTreeData(dataSourceCopy)"]
IsTree --> |No| Copy["dataSourceCopy = val.slice()"]
Flat --> Copy
Copy --> MaxSpan["updateMaxRowSpan()"]
MaxSpan --> NeedY{"length changed?"}
NeedY --> |Yes| ReinitY["nextTick initVirtualScrollY()"]
NeedY --> |No| SkipY["skip Y reinit"]
Copy --> EmptyCheck{"val.length === 0?"}
EmptyCheck --> |Yes| ClearSel["clearSelectedArea()"]
EmptyCheck --> |No| SkipClear["skip clearing"]
ClearSel --> Done(["Ready"])
SkipClear --> Done
ReinitY --> Done
SkipY --> Done
```

**Updated** Added empty data source handling logic with automatic selection clearing

**Diagram sources**
- [StkTable.vue:896-931](file://src/StkTable/StkTable.vue#L896-L931)
- [StkTable.vue:1035-1059](file://src/StkTable/StkTable.vue#L1035-L1059)
- [StkTable.vue:1070-1073](file://src/StkTable/StkTable.vue#L1070-L1073)
- [useTree.ts:121-125](file://src/StkTable/useTree.ts#L121-L125)
- [useAreaSelection.ts:762-766](file://src/StkTable/features/useAreaSelection.ts#L762-L766)

**Section sources**
- [StkTable.vue:896-931](file://src/StkTable/StkTable.vue#L896-L931)
- [StkTable.vue:1035-1059](file://src/StkTable/StkTable.vue#L1035-L1059)
- [StkTable.vue:1070-1073](file://src/StkTable/StkTable.vue#L1070-L1073)
- [useTree.ts:121-125](file://src/StkTable/useTree.ts#L121-L125)
- [useAreaSelection.ts:762-766](file://src/StkTable/features/useAreaSelection.ts#L762-L766)

### Row Key Generation and Caching
- rowKeyGenComputed is a computed that resolves either a function or property accessor from props.rowKey.
- rowKeyGen caches keys in a WeakMap keyed by row object to avoid recomputation and to keep keys stable across renders.
- Fallback: if the resolved key is undefined, a random key is generated to ensure uniqueness for UI state (e.g., highlighting).

```mermaid
flowchart TD
A["rowKeyGen(row)"] --> B{"cached in WeakMap?"}
B --> |Yes| C["return cached key"]
B --> |No| D{"row has __ROW_K__?"}
D --> |Yes| E["cache and return __ROW_K__"]
D --> |No| F["compute via rowKeyGenComputed"]
F --> G{"key is undefined?"}
G --> |Yes| H["generate random fallback key"]
G --> |No| I["use computed key"]
E --> J["cache key"]
H --> J
I --> J
J --> K["return key"]
```

**Diagram sources**
- [StkTable.vue:1083-1104](file://src/StkTable/StkTable.vue#L1083-L1104)

**Section sources**
- [StkTable.vue:1083-1104](file://src/StkTable/StkTable.vue#L1083-L1104)

### Column Key Generation and Cell Keys
- colKeyGen is a computed function derived from props.colKey. It defaults to col.key || col.dataIndex.
- cellKeyGen combines rowKeyGen(row) and colKeyGen(col) with a separator constant to form a stable cell identity.

**Section sources**
- [StkTable.vue:728-737](file://src/StkTable/StkTable.vue#L728-L737)
- [StkTable.vue:1107-1109](file://src/StkTable/StkTable.vue#L1107-L1109)
- [const.ts:37-38](file://src/StkTable/const.ts#L37-L38)

### Virtual Scrolling Calculations
- Y-axis virtualization:
  - Computes pageSize from container height and row height; adjusts for header height.
  - updateVirtualScrollY calculates startIndex/endIndex from scrollTop, supports autoRowHeight and merged rows.
  - virtual_dataSourcePart is a computed slice of dataSourceCopy for rendering.
- X-axis virtualization:
  - Uses tableHeaderLast to compute visible columns; preserves fixed left/right columns outside the viewport.
  - updateVirtualScrollX computes startIndex/endIndex from scrollLeft and column widths.

```mermaid
flowchart TD
S["onTableScroll"] --> RAF["requestAnimationFrame"]
RAF --> Y{"scrollTop changed?"}
RAF --> X{"scrollLeft changed?"}
Y --> |Yes| UY["updateVirtualScrollY(scrollTop)"]
X --> |Yes| UX["updateVirtualScrollX(scrollLeft)"]
UY --> Part["virtual_dataSourcePart (computed)"]
UX --> XPart["virtualX_columnPart (computed)"]
Part --> Render["Render visible rows"]
XPart --> Render
```

**Diagram sources**
- [StkTable.vue:1463-1497](file://src/StkTable/StkTable.vue#L1463-L1497)
- [useVirtualScroll.ts:274-407](file://src/StkTable/useVirtualScroll.ts#L274-L407)
- [useVirtualScroll.ts:414-478](file://src/StkTable/useVirtualScroll.ts#L414-L478)

**Section sources**
- [useVirtualScroll.ts:104-125](file://src/StkTable/useVirtualScroll.ts#L104-L125)
- [useVirtualScroll.ts:134-176](file://src/StkTable/useVirtualScroll.ts#L134-L176)
- [useVirtualScroll.ts:274-407](file://src/StkTable/useVirtualScroll.ts#L274-L407)
- [useVirtualScroll.ts:414-478](file://src/StkTable/useVirtualScroll.ts#L414-L478)

### Sorting and Data Immutability
- tableSort creates a new array by slicing and sorting; respects emptyToBottom, stringLocaleCompare, and sortChildren.
- In remote mode, the component emits sort-change with the proposed order and data snapshot; the parent updates props.dataSource accordingly.
- Tree data is flattened prior to sorting to maintain a flat list for virtualization.

```mermaid
sequenceDiagram
participant U as "User clicks header"
participant S as "StkTable.vue"
participant TS as "tableSort"
participant DS as "dataSourceCopy"
U->>S : "onColumnSort(col)"
alt "sortRemote or no order"
S->>TS : "tableSort(option, order, dataSource)"
TS-->>S : "sorted array"
S->>DS : "dataSourceCopy = sorted or flatTreeData(sorted)"
else "emit sort-change"
S-->>U : "emits sort-change"
end
```

**Diagram sources**
- [StkTable.vue:1239-1299](file://src/StkTable/StkTable.vue#L1239-L1299)
- [utils/index.ts:154-208](file://src/StkTable/utils/index.ts#L154-L208)
- [useTree.ts:121-125](file://src/StkTable/useTree.ts#L121-L125)

**Section sources**
- [utils/index.ts:154-208](file://src/StkTable/utils/index.ts#L154-L208)
- [StkTable.vue:1239-1299](file://src/StkTable/StkTable.vue#L1239-L1299)
- [useTree.ts:121-125](file://src/StkTable/useTree.ts#L121-L125)

### Tree Expansion and Row Expansion
- Tree expansion:
  - flatTreeData recursively flattens expanded nodes; default expand options are applied on first load.
  - toggleTreeNode/privateSetTreeExpand modify the flat array and update row flags.
- Row expansion:
  - setRowExpand inserts a synthetic expanded row with a prefixed key and clears previous expansions below the target.

```mermaid
sequenceDiagram
participant U as "User clicks expand"
participant TE as "useRowExpand.ts"
participant TS as "useTree.ts"
participant DS as "dataSourceCopy"
U->>TE : "toggleExpandRow(row, col)"
TE->>DS : "splice expanded row after target"
TE->>DS : "mark row.__EXP__"
U->>TS : "toggleTreeNode(row, col)"
TS->>DS : "expandNode(children) -> splice into flat array"
TS->>DS : "setNodeExpanded(row, true/false)"
```

**Diagram sources**
- [useRowExpand.ts:18-82](file://src/StkTable/useRowExpand.ts#L18-L82)
- [useTree.ts:17-74](file://src/StkTable/useTree.ts#L17-L74)
- [useTree.ts:127-154](file://src/StkTable/useTree.ts#L127-L154)

**Section sources**
- [useRowExpand.ts:18-82](file://src/StkTable/useRowExpand.ts#L18-L82)
- [useTree.ts:17-74](file://src/StkTable/useTree.ts#L17-L74)
- [useTree.ts:127-154](file://src/StkTable/useTree.ts#L127-L154)

### Cell Selection and Interaction State
- selectionRange tracks the current rectangular selection; normalizedRange and selectedCellKeys are computed from it.
- getCellSelectionClasses applies range-related classes to cells for visual feedback.
- Keyboard shortcuts (Ctrl/Cmd+C) copy the selected range to clipboard using a formatter callback if provided.
- **Automatic clearing: When dataSource becomes empty, clearSelectedArea() is automatically called to prevent stale selection states.**

**Updated** Added automatic selection clearing behavior

**Section sources**
- [useCellSelection.ts:52-102](file://src/StkTable/useCellSelection.ts#L52-L102)
- [useCellSelection.ts:409-422](file://src/StkTable/useCellSelection.ts#L409-L422)
- [useCellSelection.ts:357-401](file://src/StkTable/useCellSelection.ts#L357-L401)
- [useAreaSelection.ts:762-766](file://src/StkTable/features/useAreaSelection.ts#L762-L766)

### Shallow Reactivity and Performance
- dataSourceCopy is a shallowRef to minimize deep reactivity overhead while still enabling reactive updates.
- rowKeyGen uses a WeakMap cache keyed by row object to avoid unnecessary recomputation and to keep keys stable across renders.
- Virtual scrolling relies on computed slices and offsets; autoRowHeight stores measured heights in a Map keyed by rowKey to avoid repeated DOM reads.
- useTriggerRef demonstrates a pattern to trigger shallowRef updates when underlying value changes without mutating the ref directly.

**Section sources**
- [StkTable.vue:717-717](file://src/StkTable/StkTable.vue#L717-L717)
- [StkTable.vue:1083-1104](file://src/StkTable/StkTable.vue#L1083-L1104)
- [useVirtualScroll.ts:241-254](file://src/StkTable/useVirtualScroll.ts#L241-L254)
- [utils/useTriggerRef.ts:15-33](file://src/StkTable/utils/useTriggerRef.ts#L15-L33)

## Dependency Analysis
The component's dependencies are primarily composables and utilities:

```mermaid
graph LR
STK["StkTable.vue"]
VIRT["useVirtualScroll"]
TREE["useTree"]
ROWEXP["useRowExpand"]
CELLSEL["useCellSelection"]
AREASEL["useAreaSelection"]
UTILS["utils/index.ts"]
TYPES["types/index.ts"]
CONST["const.ts"]
CREF["utils/constRefUtils.ts"]
STK --> VIRT
STK --> TREE
STK --> ROWEXP
STK --> CELLSEL
STK --> AREASEL
STK --> UTILS
STK --> TYPES
STK --> CONST
STK --> CREF
```

**Diagram sources**
- [StkTable.vue:209-922](file://src/StkTable/StkTable.vue#L209-L922)
- [useVirtualScroll.ts:60-498](file://src/StkTable/useVirtualScroll.ts#L60-L498)
- [useTree.ts:12-161](file://src/StkTable/useTree.ts#L12-L161)
- [useRowExpand.ts:11-88](file://src/StkTable/useRowExpand.ts#L11-L88)
- [useCellSelection.ts:42-456](file://src/StkTable/useCellSelection.ts#L42-L456)
- [useAreaSelection.ts:13-781](file://src/StkTable/features/useAreaSelection.ts#L13-L781)
- [utils/index.ts:154-208](file://src/StkTable/utils/index.ts#L154-L208)
- [types/index.ts:54-120](file://src/StkTable/types/index.ts#L54-L120)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [utils/constRefUtils.ts:1-30](file://src/StkTable/utils/constRefUtils.ts#L1-L30)

**Section sources**
- [StkTable.vue:209-922](file://src/StkTable/StkTable.vue#L209-L922)
- [useVirtualScroll.ts:60-498](file://src/StkTable/useVirtualScroll.ts#L60-L498)
- [useTree.ts:12-161](file://src/StkTable/useTree.ts#L12-L161)
- [useRowExpand.ts:11-88](file://src/StkTable/useRowExpand.ts#L11-L88)
- [useCellSelection.ts:42-456](file://src/StkTable/useCellSelection.ts#L42-L456)
- [useAreaSelection.ts:13-781](file://src/StkTable/features/useAreaSelection.ts#L13-L781)
- [utils/index.ts:154-208](file://src/StkTable/utils/index.ts#L154-L208)
- [types/index.ts:54-120](file://src/StkTable/types/index.ts#L54-L120)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [utils/constRefUtils.ts:1-30](file://src/StkTable/utils/constRefUtils.ts#L1-L30)

## Performance Considerations
- Prefer shallowRef for large arrays to reduce deep reactivity costs.
- Cache row keys with WeakMap to avoid recomputation and to stabilize keys for UI state.
- Use virtual scrolling for large datasets; ensure column widths are set for X virtualization.
- For variable row heights, leverage autoRowHeight and measure DOM heights once per row key; avoid frequent reflows.
- Keep props immutable on the parent; pass new arrays to props.dataSource to trigger efficient updates.
- Use sortRemote for server-side sorting to avoid heavy client-side computations.
- **Empty data handling is optimized: Automatic selection clearing occurs only when dataSource becomes empty, minimizing unnecessary operations.**

## Troubleshooting Guide
- Empty or missing data: Ensure props.dataSource is an array; the component warns on invalid input and skips updates.
- **Empty data clearing: When dataSource becomes empty, selections are automatically cleared. If you need to programmatically clear selections, call the clearSelectedArea() method exposed by the component.**
- Virtual scrolling not working: Verify props.virtual/virtualX and that column widths are set for X virtualization.
- Row keys not stable: Provide a deterministic rowKey function or ensure row objects have a stable identity; undefined keys fall back to random keys.
- Sorting not applied: If sortRemote is true, listen to sort-change and update props.dataSource accordingly.
- Tree expansion issues: Confirm treeConfig defaults and that data is properly flattened before virtualization.
- **Selection persistence issues: If selections appear after clearing data, ensure you're using the latest version where automatic clearing is implemented.**

**Updated** Added troubleshooting guidance for empty data scenarios and selection clearing

**Section sources**
- [StkTable.vue:1058-1061](file://src/StkTable/StkTable.vue#L1058-L1061)
- [StkTable.vue:1070-1073](file://src/StkTable/StkTable.vue#L1070-L1073)
- [StkTable.vue:1239-1299](file://src/StkTable/StkTable.vue#L1239-L1299)
- [StkTable.vue:1083-1104](file://src/StkTable/StkTable.vue#L1083-L1104)
- [useTree.ts:121-125](file://src/StkTable/useTree.ts#L121-L125)
- [useAreaSelection.ts:762-766](file://src/StkTable/features/useAreaSelection.ts#L762-L766)

## Conclusion
Stk Table Vue's reactive architecture centers on shallow reactive references for large datasets, computed-derived virtualized slices, and carefully managed key generation. The component transforms props.dataSource into a mutable shallowRef copy, applies transformations (flattening, sorting, expansion), and exposes computed views for rendering. **Enhanced empty data handling ensures consistent UI states by automatically clearing selections when data sources become empty, preventing stale selection artifacts.** By combining virtual scrolling, caching, and immutable transformations with intelligent empty state management, it achieves responsive performance for large datasets while maintaining predictable data flow and clear separation of concerns.