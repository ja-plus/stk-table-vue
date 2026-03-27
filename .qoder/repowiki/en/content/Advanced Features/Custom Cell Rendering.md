# Custom Cell Rendering

<cite>
**Referenced Files in This Document**
- [StkTable.vue](file://src/StkTable/StkTable.vue)
- [types/index.ts](file://src/StkTable/types/index.ts)
- [useVirtualScroll.ts](file://src/StkTable/useVirtualScroll.ts)
- [custom-cell.md](file://docs-src/main/table/advanced/custom-cell.md)
- [CustomCell/index.vue](file://docs-demo/advanced/custom-cell/CustomCell/index.vue)
- [YieldCell.vue](file://docs-demo/advanced/custom-cell/CustomCell/YieldCell.vue)
- [types.ts](file://docs-demo/advanced/custom-cell/CustomCell/types.ts)
- [CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue)
- [EditCell.vue](file://docs-demo/demos/CellEdit/EditCell.vue)
- [type.ts](file://docs-demo/demos/CellEdit/type.ts)
- [HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue)
- [ExpandCell.vue](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue)
- [SourceCell.vue](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue)
- [types.ts](file://docs-demo/demos/HugeData/types.ts)
- [event.ts](file://docs-demo/demos/HugeData/event.ts)
- [MatrixCell.vue](file://docs-demo/demos/Matrix/MatrixCell.vue)
- [custom-cell.md](file://docs-src/ko/main/table/advanced/custom-cell.md)
</cite>

## Update Summary
**Changes Made**
- Added comprehensive Korean documentation coverage for custom cell rendering patterns
- Enhanced documentation with Vue SFC component examples, render functions, and JSX syntax
- Expanded practical implementation guidance with real-world use cases
- Added detailed API documentation and TypeScript type definitions
- Included performance considerations and troubleshooting guides in Korean

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
This document explains custom cell rendering in Stk Table Vue with a focus on three implementation patterns:
- Slot-based cell customization via the table body and header slots
- Component-based cell rendering using the customCell and customHeaderCell column properties
- Yield-based cell implementation patterns using render functions and JSX

It documents the cell rendering lifecycle, prop passing mechanisms, and event handling within custom cells. It also provides comprehensive examples for editable cells, action buttons, progress indicators, and rich content displays, along with performance considerations and best practices for smooth scrolling with complex cell content.

**Updated** Enhanced with comprehensive Korean documentation covering Vue SFC components, render functions, and JSX syntax for custom cell creation.

## Project Structure
The repository organizes custom cell examples under docs-demo and the core table implementation under src/StkTable. The documentation for custom cells is located in docs-src with support for multiple languages including Korean.

```mermaid
graph TB
subgraph "Docs Demos"
A["advanced/custom-cell/CustomCell/index.vue"]
B["advanced/custom-cell/CustomCell/YieldCell.vue"]
C["demos/CellEdit/index.vue"]
D["demos/CellEdit/EditCell.vue"]
E["demos/HugeData/index.vue"]
F["demos/HugeData/custom-cells/ExpandCell.vue"]
G["demos/HugeData/custom-cells/SourceCell.vue"]
H["demos/Matrix/MatrixCell.vue"]
end
subgraph "Core Implementation"
I["src/StkTable/StkTable.vue"]
J["src/StkTable/types/index.ts"]
K["src/StkTable/useVirtualScroll.ts"]
end
L["docs-src/main/table/advanced/custom-cell.md"]
M["docs-src/ko/main/table/advanced/custom-cell.md"]
A --> I
B --> I
C --> I
D --> I
E --> I
F --> I
G --> I
H --> I
I --> J
I --> K
L --> I
L --> J
M --> I
M --> J
```

**Diagram sources**
- [StkTable.vue:135-153](file://src/StkTable/StkTable.vue#L135-L153)
- [types/index.ts:8-23](file://src/StkTable/types/index.ts#L8-L23)
- [useVirtualScroll.ts:104-108](file://src/StkTable/useVirtualScroll.ts#L104-L108)
- [custom-cell.md:1-147](file://docs-src/main/table/advanced/custom-cell.md#L1-L147)
- [custom-cell.md:1-157](file://docs-src/ko/main/table/advanced/custom-cell.md#L1-L157)
- [CustomCell/index.vue:1-24](file://docs-demo/advanced/custom-cell/CustomCell/index.vue#L1-L24)
- [YieldCell.vue:1-28](file://docs-demo/advanced/custom-cell/CustomCell/YieldCell.vue#L1-L28)
- [CellEdit/index.vue:1-50](file://docs-demo/demos/CellEdit/index.vue#L1-L50)
- [EditCell.vue:1-92](file://docs-demo/demos/CellEdit/EditCell.vue#L1-L92)
- [HugeData/index.vue:1-200](file://docs-demo/demos/HugeData/index.vue#L1-L200)
- [ExpandCell.vue:1-37](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L37)
- [SourceCell.vue:1-19](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue#L1-L19)
- [MatrixCell.vue:1-91](file://docs-demo/demos/Matrix/MatrixCell.vue#L1-L91)

**Section sources**
- [StkTable.vue:135-153](file://src/StkTable/StkTable.vue#L135-L153)
- [custom-cell.md:1-147](file://docs-src/main/table/advanced/custom-cell.md#L1-L147)
- [custom-cell.md:1-157](file://docs-src/ko/main/table/advanced/custom-cell.md#L1-L157)

## Core Components
- Custom cell props interface: Defines the shape of props passed to customCell components, including row, col, cellValue, rowIndex, colIndex, expanded, and treeExpanded.
- Column configuration: Supports customCell and customHeaderCell to plug in custom renderers for body and header cells.
- Virtual scrolling integration: Renders only visible rows/columns and passes accurate indices and values to custom cells.

Key implementation references:
- CustomCellProps definition and CustomCell type
- Column customCell/customHeaderCell usage in template rendering
- Virtual data source slicing and index computation

**Section sources**
- [types/index.ts:8-23](file://src/StkTable/types/index.ts#L8-L23)
- [types/index.ts:49-52](file://src/StkTable/types/index.ts#L49-L52)
- [StkTable.vue:135-153](file://src/StkTable/StkTable.vue#L135-L153)
- [useVirtualScroll.ts:104-108](file://src/StkTable/useVirtualScroll.ts#L104-L108)

## Architecture Overview
The table renders cells by either:
- Using a default renderer for simple values
- Rendering a custom component when customCell is provided
- Falling back to slots for header customization

```mermaid
sequenceDiagram
participant App as "App"
participant Table as "StkTable.vue"
participant Col as "Column Config"
participant Comp as "CustomCell Component"
App->>Table : Provide columns with customCell
Table->>Col : Iterate rows × columns
alt customCell present
Table->>Comp : Render with props (row, col, cellValue, rowIndex, colIndex, expanded, treeExpanded)
Comp-->>Table : DOM subtree
else default
Table-->>Table : Render plain text or icon
end
Table-->>App : Finalized table with custom cells
```

**Diagram sources**
- [StkTable.vue:135-153](file://src/StkTable/StkTable.vue#L135-L153)
- [types/index.ts:8-23](file://src/StkTable/types/index.ts#L8-L23)

## Detailed Component Analysis

### Slot-Based Cell Customization
- Body slot: The table exposes a slot for customizing expanded row content and other body areas.
- Header slot: The table supports a named slot for header content when no customHeaderCell is configured.

Practical usage:
- Use the expand row slot to render rich content when a row is expanded.
- Use the tableHeader slot to wrap header titles with additional UI.

**Section sources**
- [StkTable.vue:121-124](file://src/StkTable/StkTable.vue#L121-L124)
- [StkTable.vue:91-93](file://src/StkTable/StkTable.vue#L91-L93)

### Component-Based Cell Rendering
- Columns accept customCell and customHeaderCell as Vue components or render functions.
- The table passes a strongly typed CustomCellProps object to each custom cell component.

Implementation highlights:
- Props include row, col, cellValue, rowIndex, colIndex, expanded, and treeExpanded.
- The table conditionally renders a component or falls back to default text/icon rendering.

Examples:
- YieldCell demonstrates conditional styling and formatted display based on numeric values.
- EditCell demonstrates interactive editing with input controls and reactive updates.
- ExpandCell demonstrates emitting events to toggle row expansion.
- SourceCell demonstrates mapping discrete values to styled labels.
- MatrixCell demonstrates rich layout with gradient backgrounds and directional indicators.

**Section sources**
- [types/index.ts:8-23](file://src/StkTable/types/index.ts#L8-L23)
- [StkTable.vue:135-153](file://src/StkTable/StkTable.vue#L135-L153)
- [YieldCell.vue:1-28](file://docs-demo/advanced/custom-cell/CustomCell/YieldCell.vue#L1-L28)
- [EditCell.vue:1-92](file://docs-demo/demos/CellEdit/EditCell.vue#L1-L92)
- [ExpandCell.vue:1-37](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L37)
- [SourceCell.vue:1-19](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue#L1-L19)
- [MatrixCell.vue:1-91](file://docs-demo/demos/Matrix/MatrixCell.vue#L1-L91)

### Vue SFC Components for Custom Cells
Vue Single File Components (SFC) provide a structured approach to creating reusable custom cells with proper TypeScript integration.

**Implementation Pattern**:
- Define custom cell component with `CustomCellProps` interface
- Use Vue 3 Composition API with TypeScript
- Implement computed properties for dynamic styling
- Export component for reuse across different tables

**Example Structure**:
```vue
<script lang="ts" setup>
import { computed } from 'vue';
import { CustomCellProps } from 'stk-table-vue/src/StkTable/types/index';

const props = defineProps<CustomCellProps<DataType>>();
const className = computed(() => {
    return props.cellValue > 0 ? 'color-up' : 'color-down';
});
</script>
<template>
    <span :class="className">{{ props.cellValue > 0 ? '+' : '' }}{{ (props.cellValue * 100).toFixed(4) }}%</span>
</template>
```

**Section sources**
- [custom-cell.md:13-67](file://docs-src/ko/main/table/advanced/custom-cell.md#L13-L67)
- [YieldCell.vue:1-28](file://docs-demo/advanced/custom-cell/CustomCell/YieldCell.vue#L1-L28)
- [CustomCell/index.vue:1-24](file://docs-demo/advanced/custom-cell/CustomCell/index.vue#L1-L24)

### Render Functions with h() for Lightweight Components
Render functions offer a concise way to create lightweight custom cells without the overhead of SFC compilation.

**Usage Pattern**:
- Import Vue's `h` function for creating VNodes
- Return simple JSX-like expressions directly in column configuration
- Ideal for basic transformations and simple conditional rendering

**Example Implementation**:
```typescript
import { h } from 'vue';
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

const columns: StkTableColumn<any>[] = [
    {
        title: 'Yield',
        dataIndex: 'yield',
        customCell: ({ cellValue }) => h('span', `${cellValue * 100}%`),
    },
]
```

**Section sources**
- [custom-cell.md:71-85](file://docs-src/ko/main/table/advanced/custom-cell.md#L71-L85)

### JSX Syntax for Complex Cell Implementations
JSX enables expressive markup with build tool support for complex custom cell implementations.

**Setup Requirements**:
- Install appropriate JSX plugin based on build tool
- Configure TypeScript for JSX support
- Use functional components with JSX syntax

**Build Tool Compatibility**:
| Build Tool | Plugin |
|---|---|
| Vite | @vitejs/plugin-vue-jsx |
| Webpack + Babel | @vue/babel-plugin-jsx |
| Webpack + SWC | swc-plugin-vue-jsx |
| Rspack | swc-plugin-vue-jsx |

**Example Implementation**:
```tsx
import { StkTableColumn } from 'stk-table-vue/src/StkTable/index';

const columns: StkTableColumn<any>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        customCell: ({ row, col, cellValue }) => {
            return <span style="color: red">{cellValue}</span>;
        },
    },
]
```

**Section sources**
- [custom-cell.md:87-109](file://docs-src/ko/main/table/advanced/custom-cell.md#L87-L109)

### Cell Rendering Lifecycle and Prop Passing
- Lifecycle: Cells are created during virtualized rendering of visible rows/columns. Props are recomputed per render pass.
- Prop passing: The table computes and passes row, col, cellValue, rowIndex, colIndex, expanded, and treeExpanded to custom cells.

```mermaid
flowchart TD
Start(["Render Pass"]) --> Compute["Compute Visible Rows/Columns"]
Compute --> ForEach["For each visible cell"]
ForEach --> Props["Assemble CustomCellProps"]
Props --> Render["Render customCell or default"]
Render --> End(["Commit to DOM"])
```

**Diagram sources**
- [StkTable.vue:104-176](file://src/StkTable/StkTable.vue#L104-L176)
- [useVirtualScroll.ts:104-108](file://src/StkTable/useVirtualScroll.ts#L104-L108)
- [types/index.ts:8-23](file://src/StkTable/types/index.ts#L8-L23)

### Event Handling Within Custom Cells
- Emitting events: Custom cells can emit domain-specific events (e.g., toggling expand state).
- Listening to events: Parent components can subscribe to these events to orchestrate side effects.

Example pattern:
- ExpandCell emits a toggle-expand event; parent subscribes and toggles row expansion state.

**Section sources**
- [ExpandCell.vue:8-10](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L8-L10)
- [event.ts:4-6](file://docs-demo/demos/HugeData/event.ts#L4-L6)

### Comprehensive Examples

#### Editable Cells
- Behavior: Double-click to enter edit mode; Enter to save, Escape to cancel; blur to commit or revert.
- Reactive updates: Editing updates the underlying row data; watchers keep local editValue in sync.
- Row-level editing: An auxiliary control switches entire rows into edit mode.

```mermaid
sequenceDiagram
participant User as "User"
participant Cell as "EditCell.vue"
participant Table as "StkTable.vue"
participant Data as "Row Data"
User->>Cell : Double-click cell
Cell->>Cell : Set editing = true
User->>Cell : Type value and press Enter
Cell->>Data : Update row[col.dataIndex] = newValue
Cell-->>Table : Commit changes
Table-->>User : Re-render with updated value
```

**Diagram sources**
- [EditCell.vue:38-72](file://docs-demo/demos/CellEdit/EditCell.vue#L38-L72)
- [CellEdit/index.vue:32-38](file://docs-demo/demos/CellEdit/index.vue#L32-L38)

**Section sources**
- [EditCell.vue:1-92](file://docs-demo/demos/CellEdit/EditCell.vue#L1-L92)
- [CellEdit/index.vue:1-50](file://docs-demo/demos/CellEdit/index.vue#L1-L50)
- [type.ts:1-15](file://docs-demo/demos/CellEdit/type.ts#L1-L15)

#### Action Buttons
- Pattern: Render clickable actions (e.g., expand/collapse) inside a custom cell component.
- Interaction: Emit events to parent; parent toggles row state.

**Section sources**
- [ExpandCell.vue:1-37](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L37)
- [event.ts:1-7](file://docs-demo/demos/HugeData/event.ts#L1-L7)
- [HugeData/index.vue:1-200](file://docs-demo/demos/HugeData/index.vue#L1-L200)

#### Progress Indicators
- Pattern: Use a rich layout with gradient backgrounds and directional indicators to visualize metrics.
- Data binding: Bind CSS variables to dynamic values for percent and color.

**Section sources**
- [MatrixCell.vue:1-91](file://docs-demo/demos/Matrix/MatrixCell.vue#L1-L91)

#### Rich Content Displays
- Pattern: Combine multiple values and icons into a single cell for compact, informative layouts.
- Styling: Use scoped styles and CSS custom properties for consistent theming.

**Section sources**
- [YieldCell.vue:1-28](file://docs-demo/advanced/custom-cell/CustomCell/YieldCell.vue#L1-L28)
- [SourceCell.vue:1-19](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue#L1-L19)

## Dependency Analysis
Custom cell rendering depends on:
- Column configuration specifying customCell/customHeaderCell
- Strongly typed props provided by the table
- Virtual scrolling for efficient rendering of large datasets

```mermaid
graph LR
Types["types/index.ts<br/>CustomCellProps, CustomCell"] --> Table["StkTable.vue<br/>rendering loop"]
Table --> Virtual["useVirtualScroll.ts<br/>visible range"]
Table --> DemoYield["YieldCell.vue"]
Table --> DemoEdit["EditCell.vue"]
Table --> DemoExpand["ExpandCell.vue"]
Table --> DemoSource["SourceCell.vue"]
Table --> DemoMatrix["MatrixCell.vue"]
```

**Diagram sources**
- [types/index.ts:8-23](file://src/StkTable/types/index.ts#L8-L23)
- [StkTable.vue:135-153](file://src/StkTable/StkTable.vue#L135-L153)
- [useVirtualScroll.ts:104-108](file://src/StkTable/useVirtualScroll.ts#L104-L108)
- [YieldCell.vue:1-28](file://docs-demo/advanced/custom-cell/CustomCell/YieldCell.vue#L1-L28)
- [EditCell.vue:1-92](file://docs-demo/demos/CellEdit/EditCell.vue#L1-L92)
- [ExpandCell.vue:1-37](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L37)
- [SourceCell.vue:1-19](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue#L1-L19)
- [MatrixCell.vue:1-91](file://docs-demo/demos/Matrix/MatrixCell.vue#L1-L91)

**Section sources**
- [types/index.ts:8-23](file://src/StkTable/types/index.ts#L8-L23)
- [StkTable.vue:135-153](file://src/StkTable/StkTable.vue#L135-L153)
- [useVirtualScroll.ts:104-108](file://src/StkTable/useVirtualScroll.ts#L104-L108)

## Performance Considerations
- Keep custom cells lightweight:
  - Avoid heavy computations in templates; precompute where possible.
  - Minimize deep reactivity; use shallow refs for large datasets.
- Prefer render functions or simple components for trivial content to reduce overhead.
- Use virtual scrolling:
  - Ensure row heights are stable or configure autoRowHeight appropriately.
  - For horizontal virtualization, set explicit widths on columns.
- Optimize DOM:
  - Wrap custom cells in a single block element to avoid TextNode layout pitfalls.
  - Avoid inline layouts in virtualized contexts; prefer block-level containers.
- Reduce event listener noise:
  - Debounce or coalesce frequent events.
  - Limit global event subscriptions; prefer scoped emissions.

**Updated** Enhanced with Korean-specific performance guidelines and best practices for custom cell rendering.

## Troubleshooting Guide
Common issues and resolutions:
- Layout anomalies with virtual lists:
  - Ensure custom cells wrap content in a block-level element.
  - Avoid inline styles that can interfere with virtualized row heights.
- Excessive re-renders:
  - Memoize derived values; compute outside the render function.
  - Use shallow refs for row objects to prevent unnecessary invalidations.
- Horizontal virtual scrolling misalignment:
  - Provide explicit widths for all columns; avoid min/max width conflicts.
- Events not propagating:
  - Verify custom cells emit the correct event names and payload shapes.
  - Subscribe in the parent and update row state accordingly.

**Section sources**
- [custom-cell.md:8-11](file://docs-src/main/table/advanced/custom-cell.md#L8-L11)
- [custom-cell.md:8-11](file://docs-src/ko/main/table/advanced/custom-cell.md#L8-L11)
- [ExpandCell.vue:8-10](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L8-L10)
- [event.ts:4-6](file://docs-demo/demos/HugeData/event.ts#L4-L6)

## Conclusion
Stk Table Vue offers flexible, high-performance custom cell rendering through component-based, slot-based, and yield-based patterns. By leveraging the provided CustomCellProps, integrating with virtual scrolling, and following performance best practices, you can implement rich, interactive cells while maintaining smooth scrolling performance across large datasets.

**Updated** The Korean documentation now provides comprehensive coverage of all custom cell rendering patterns, including Vue SFC components, render functions, and JSX syntax, enabling developers to create complex cell content with proper TypeScript integration and build tool support.