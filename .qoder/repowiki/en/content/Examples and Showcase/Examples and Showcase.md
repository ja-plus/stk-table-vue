# Examples and Showcase

<cite>
**Referenced Files in This Document**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue)
- [docs-demo/demos/HugeData/columns.ts](file://docs-demo/demos/HugeData/columns.ts)
- [docs-demo/demos/HugeData/mockData.ts](file://docs-demo/demos/HugeData/mockData.ts)
- [docs-demo/demos/HugeData/types.ts](file://docs-demo/demos/HugeData/types.ts)
- [docs-demo/demos/HugeData/custom-cells/ExpandCell.vue](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue)
- [docs-demo/demos/HugeData/custom-cells/SourceCell.vue](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue)
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue)
- [docs-demo/demos/Matrix/type.ts](file://docs-demo/demos/Matrix/type.ts)
- [docs-demo/demos/Matrix/MatrixCell.vue](file://docs-demo/demos/Matrix/MatrixCell.vue)
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue)
- [docs-demo/demos/PanelTree/type.ts](file://docs-demo/demos/PanelTree/type.ts)
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue)
- [docs-demo/demos/VirtualList/types.ts](file://docs-demo/demos/VirtualList/types.ts)
- [docs-demo/demos/VirtualList/Panel.vue](file://docs-demo/demos/VirtualList/Panel.vue)
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue)
- [docs-demo/demos/CellEdit/type.ts](file://docs-demo/demos/CellEdit/type.ts)
- [docs-demo/demos/CellEdit/EditCell.vue](file://docs-demo/demos/CellEdit/EditCell.vue)
- [docs-demo/demos/CellEdit/EditRowSwitch.vue](file://docs-demo/demos/CellEdit/EditRowSwitch.vue)
</cite>

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
10. [Appendices](#appendices)

## Introduction
This document showcases practical implementation examples and real-world use cases powered by StkTable Vue. It covers:
- Huge data demonstration with performance controls and virtualization
- Matrix table examples with custom cells and periodic updates
- Panel tree implementations with nested rows and highlighting
- Virtual list patterns for non-tabular content
- Cell editing scenarios with interactive data manipulation
- Dynamic column management and merging strategies
- Integration patterns with state management and backend services

Each example includes step-by-step implementation guidance, diagrams, and references to the exact source files for reproducibility.

## Project Structure
The examples are organized under docs-demo/demos with dedicated folders per feature. Each demo includes:
- An index.vue entry component
- Supporting TypeScript types
- Optional custom cell components
- Optional mock data and configuration files

```mermaid
graph TB
subgraph "HugeData Demo"
HD_IDX["HugeData/index.vue"]
HD_COLS["HugeData/columns.ts"]
HD_MOCK["HugeData/mockData.ts"]
HD_TYPES["HugeData/types.ts"]
HD_EXPAND["HugeData/custom-cells/ExpandCell.vue"]
HD_SOURCE["HugeData/custom-cells/SourceCell.vue"]
end
subgraph "Matrix Demo"
M_IDX["Matrix/index.vue"]
M_TYPES["Matrix/type.ts"]
M_CELL["Matrix/MatrixCell.vue"]
end
subgraph "PanelTree Demo"
PT_IDX["PanelTree/index.vue"]
PT_TYPES["PanelTree/type.ts"]
end
subgraph "VirtualList Demo"
VL_IDX["VirtualList/index.vue"]
VL_TYPES["VirtualList/types.ts"]
VL_PANEL["VirtualList/Panel.vue"]
end
subgraph "CellEdit Demo"
CE_IDX["CellEdit/index.vue"]
CE_TYPES["CellEdit/type.ts"]
CE_EDIT["CellEdit/EditCell.vue"]
CE_SWITCH["CellEdit/EditRowSwitch.vue"]
end
HD_IDX --> HD_COLS
HD_IDX --> HD_MOCK
HD_IDX --> HD_TYPES
HD_IDX --> HD_EXPAND
HD_IDX --> HD_SOURCE
M_IDX --> M_TYPES
M_IDX --> M_CELL
PT_IDX --> PT_TYPES
VL_IDX --> VL_TYPES
VL_IDX --> VL_PANEL
CE_IDX --> CE_TYPES
CE_IDX --> CE_EDIT
CE_IDX --> CE_SWITCH
```

**Diagram sources**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L1-L373)
- [docs-demo/demos/HugeData/columns.ts](file://docs-demo/demos/HugeData/columns.ts#L1-L223)
- [docs-demo/demos/HugeData/mockData.ts](file://docs-demo/demos/HugeData/mockData.ts#L1-L51)
- [docs-demo/demos/HugeData/types.ts](file://docs-demo/demos/HugeData/types.ts#L1-L52)
- [docs-demo/demos/HugeData/custom-cells/ExpandCell.vue](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L37)
- [docs-demo/demos/HugeData/custom-cells/SourceCell.vue](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue#L1-L19)
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L1-L121)
- [docs-demo/demos/Matrix/type.ts](file://docs-demo/demos/Matrix/type.ts#L1-L16)
- [docs-demo/demos/Matrix/MatrixCell.vue](file://docs-demo/demos/Matrix/MatrixCell.vue#L1-L91)
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue#L1-L333)
- [docs-demo/demos/PanelTree/type.ts](file://docs-demo/demos/PanelTree/type.ts#L1-L13)
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L1-L43)
- [docs-demo/demos/VirtualList/types.ts](file://docs-demo/demos/VirtualList/types.ts#L1-L6)
- [docs-demo/demos/VirtualList/Panel.vue](file://docs-demo/demos/VirtualList/Panel.vue#L1-L42)
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue#L1-L50)
- [docs-demo/demos/CellEdit/type.ts](file://docs-demo/demos/CellEdit/type.ts#L1-L15)
- [docs-demo/demos/CellEdit/EditCell.vue](file://docs-demo/demos/CellEdit/EditCell.vue#L1-L92)
- [docs-demo/demos/CellEdit/EditRowSwitch.vue](file://docs-demo/demos/CellEdit/EditRowSwitch.vue#L1-L28)

**Section sources**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L1-L373)
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L1-L121)
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue#L1-L333)
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L1-L43)
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue#L1-L50)

## Core Components
- HugeData: Demonstrates large datasets with virtual scrolling, sorting, merging, and periodic updates.
- Matrix: Builds a matrix-like table with custom cells and periodic percentage updates.
- PanelTree: Renders hierarchical data with tree nodes, fixed columns, and row highlighting.
- VirtualList: Uses StkTable as a virtualized list container for rich card-like items.
- CellEdit: Enables inline editing per cell and row-level editing mode.

**Section sources**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L1-L373)
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L1-L121)
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue#L1-L333)
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L1-L43)
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue#L1-L50)

## Architecture Overview
The demos share a common pattern:
- A StkTable component is configured via props (columns, data-source, virtualization flags).
- Custom cells encapsulate rendering and interactivity.
- Utilities and helpers manage sorting, merging, and highlighting.
- Optional event emitters coordinate actions like expanding rows.

```mermaid
graph TB
STK["StkTable.vue (docs-demo/StkTable.vue)"]
HD_IDX["HugeData/index.vue"]
M_IDX["Matrix/index.vue"]
PT_IDX["PanelTree/index.vue"]
VL_IDX["VirtualList/index.vue"]
CE_IDX["CellEdit/index.vue"]
HD_IDX --> STK
M_IDX --> STK
PT_IDX --> STK
VL_IDX --> STK
CE_IDX --> STK
HD_EXPAND["ExpandCell.vue"]
HD_SOURCE["SourceCell.vue"]
M_CELL["MatrixCell.vue"]
VL_PANEL["Panel.vue"]
CE_EDIT["EditCell.vue"]
CE_SWITCH["EditRowSwitch.vue"]
HD_IDX --> HD_EXPAND
HD_IDX --> HD_SOURCE
M_IDX --> M_CELL
VL_IDX --> VL_PANEL
CE_IDX --> CE_EDIT
CE_IDX --> CE_SWITCH
```

**Diagram sources**
- [docs-demo/StkTable.vue](file://docs-demo/StkTable.vue#L1-L200)
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L1-L373)
- [docs-demo/demos/HugeData/custom-cells/ExpandCell.vue](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L37)
- [docs-demo/demos/HugeData/custom-cells/SourceCell.vue](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue#L1-L19)
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L1-L121)
- [docs-demo/demos/Matrix/MatrixCell.vue](file://docs-demo/demos/Matrix/MatrixCell.vue#L1-L91)
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L1-L43)
- [docs-demo/demos/VirtualList/Panel.vue](file://docs-demo/demos/VirtualList/Panel.vue#L1-L42)
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue#L1-L50)
- [docs-demo/demos/CellEdit/EditCell.vue](file://docs-demo/demos/CellEdit/EditCell.vue#L1-L92)
- [docs-demo/demos/CellEdit/EditRowSwitch.vue](file://docs-demo/demos/CellEdit/EditRowSwitch.vue#L1-L28)

## Detailed Component Analysis

### Huge Data Demonstration
This demo simulates a financial market feed with:
- Large dataset generation and sorting
- Periodic updates with highlight feedback
- Expandable child rows
- Column merging (rowspan/colspan)
- Virtual scrolling and performance toggles

Key capabilities:
- Dynamic data size selection and initialization
- Sorting configuration and remote sorting support
- Highlighting updated rows after insertion
- Toggle for row-by-row scrolling and translateZ stacking

```mermaid
sequenceDiagram
participant U as "User"
participant IDX as "HugeData/index.vue"
participant TBL as "StkTable"
participant EVT as "Emitter"
participant UTIL as "tableSort/insertToOrderedArray"
U->>IDX : "Start simulation"
loop Every updateFreq
IDX->>UTIL : "Generate new row and insert into sorted array"
UTIL-->>IDX : "Updated ordered data"
IDX->>TBL : "Highlight updated row"
end
U->>IDX : "Toggle expand"
IDX->>EVT : "emit('toggle-expand', row)"
EVT-->>IDX : "Expand handler updates dataSource"
IDX->>TBL : "Re-render with expanded rows"
```

**Diagram sources**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L120-L174)
- [docs-demo/demos/HugeData/custom-cells/ExpandCell.vue](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L37)

Implementation highlights:
- Columns definition with fixed left columns, sorting, alignment, and custom cells for special rows.
- Mock data template reused across generated rows.
- Sorting state and sort-change handler.
- Highlighting via setHighlightDimRow after nextTick.
- Merge cells toggled for rowspan/colspan tests.

Practical steps:
- Initialize columns and data source on mount.
- Simulate periodic updates and re-sort using binary insertion.
- Toggle virtualization and scroll modes for performance tuning.

**Section sources**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L1-L373)
- [docs-demo/demos/HugeData/columns.ts](file://docs-demo/demos/HugeData/columns.ts#L1-L223)
- [docs-demo/demos/HugeData/mockData.ts](file://docs-demo/demos/HugeData/mockData.ts#L1-L51)
- [docs-demo/demos/HugeData/types.ts](file://docs-demo/demos/HugeData/types.ts#L1-L52)
- [docs-demo/demos/HugeData/custom-cells/ExpandCell.vue](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L37)
- [docs-demo/demos/HugeData/custom-cells/SourceCell.vue](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue#L1-L19)

### Matrix Table Example
This demo builds a matrix with:
- Four time buckets (1M, 3M, 6M, 1Y)
- Custom cell component rendering code/value/count/bp with gradient percent bar
- Periodic updates to the last column’s percent values
- Highlighting a specific cell after targeted update

```mermaid
sequenceDiagram
participant U as "User"
participant IDX as "Matrix/index.vue"
participant TBL as "StkTable"
participant CELL as "MatrixCell.vue"
U->>IDX : "Click 'Try Update'"
IDX->>CELL : "Update cell data"
IDX->>TBL : "Highlight cell via setHighlightDimCell"
U->>IDX : "Start/Stop 'Update Last Column'"
loop Every 100ms
IDX->>IDX : "Increment percent for each row in last column"
end
```

**Diagram sources**
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L81-L100)
- [docs-demo/demos/Matrix/MatrixCell.vue](file://docs-demo/demos/Matrix/MatrixCell.vue#L1-L91)

Implementation highlights:
- Columns with customCell for each bucket.
- Initialization of row data with random values.
- Interval-based updates to the last column’s percent values.
- Highlighting a single cell using setHighlightDimCell.

**Section sources**
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L1-L121)
- [docs-demo/demos/Matrix/type.ts](file://docs-demo/demos/Matrix/type.ts#L1-L16)
- [docs-demo/demos/Matrix/MatrixCell.vue](file://docs-demo/demos/Matrix/MatrixCell.vue#L1-L91)

### Panel Tree Implementation
This demo renders hierarchical data as a tree with:
- Fixed left columns for ID/name
- Sorting on age with sortChildren enabled
- Row-level highlighting and empty cell customization
- Default expansion for top-level keys

```mermaid
flowchart TD
Start(["Render PanelTree"]) --> InitCols["Define columns with tree-node type<br/>and fixed left columns"]
InitCols --> InitData["Initialize hierarchical data with children"]
InitData --> Render["Render StkTable with tree-config"]
Render --> Interact{"User Interaction?"}
Interact --> |Update Row| Update["Modify row field and highlight via setHighlightDimRow"]
Interact --> |Sort Age| Sort["Sort children when enabled"]
Update --> Render
Sort --> Render
```

**Diagram sources**
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue#L34-L320)
- [docs-demo/demos/PanelTree/type.ts](file://docs-demo/demos/PanelTree/type.ts#L1-L13)

Implementation highlights:
- Column with type tree-node and fixed left columns.
- Empty cell text customized for parent rows.
- Row active disabled for parent rows.
- Highlighting via setHighlightDimRow after nextTick.

**Section sources**
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue#L1-L333)
- [docs-demo/demos/PanelTree/type.ts](file://docs-demo/demos/PanelTree/type.ts#L1-L13)

### Virtual List Pattern
This demo uses StkTable as a virtualized list container:
- Single column with a custom cell component rendering a panel-like layout
- Fixed row height and headless mode
- Non-tabular content with shadow and rounded corners

```mermaid
sequenceDiagram
participant IDX as "VirtualList/index.vue"
participant TBL as "StkTable"
participant CELL as "Panel.vue"
IDX->>IDX : "Generate mock data with title/content/date"
IDX->>TBL : "Pass data-source and custom cell"
TBL->>CELL : "Render each row with panel layout"
```

**Diagram sources**
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L1-L43)
- [docs-demo/demos/VirtualList/types.ts](file://docs-demo/demos/VirtualList/types.ts#L1-L6)
- [docs-demo/demos/VirtualList/Panel.vue](file://docs-demo/demos/VirtualList/Panel.vue#L1-L42)

**Section sources**
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L1-L43)
- [docs-demo/demos/VirtualList/types.ts](file://docs-demo/demos/VirtualList/types.ts#L1-L6)
- [docs-demo/demos/VirtualList/Panel.vue](file://docs-demo/demos/VirtualList/Panel.vue#L1-L42)

### Cell Editing Scenarios
This demo supports:
- Double-click to edit individual cells
- Real-time editing when row is in edit mode
- Row-level toggle to enable/disable editing mode
- Persisting edits back to the data model

```mermaid
flowchart TD
Start(["Cell Edit Demo"]) --> Click["Double-click cell"]
Click --> EditMode{"Row in edit mode?"}
EditMode --> |No| StartEdit["Enter cell edit mode"]
EditMode --> |Yes| RealTime["Real-time update on change"]
StartEdit --> Save["Enter/ESC to save/cancel"]
Save --> Update["Set cell value in row"]
RealTime --> Update
Update --> Done(["Done"])
```

**Diagram sources**
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue#L32-L48)
- [docs-demo/demos/CellEdit/EditCell.vue](file://docs-demo/demos/CellEdit/EditCell.vue#L38-L72)
- [docs-demo/demos/CellEdit/EditRowSwitch.vue](file://docs-demo/demos/CellEdit/EditRowSwitch.vue#L13-L17)

Implementation highlights:
- Custom cell EditCell handles double-click, blur, enter, and escape events.
- EditRowSwitch toggles row-level editing mode.
- Data binding persists changes to the underlying row.

**Section sources**
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue#L1-L50)
- [docs-demo/demos/CellEdit/type.ts](file://docs-demo/demos/CellEdit/type.ts#L1-L15)
- [docs-demo/demos/CellEdit/EditCell.vue](file://docs-demo/demos/CellEdit/EditCell.vue#L1-L92)
- [docs-demo/demos/CellEdit/EditRowSwitch.vue](file://docs-demo/demos/CellEdit/EditRowSwitch.vue#L1-L28)

## Dependency Analysis
The demos depend on shared StkTable components and utilities:
- StkTable props: columns, dataSource, rowKey, virtual/virtual-x, scroll options, sort config, mergeCells, highlight methods.
- Custom cells encapsulate presentation and interaction logic.
- Utilities for sorting and insertion are used in HugeData.

```mermaid
graph LR
HD_IDX["HugeData/index.vue"] --> HD_COLS["columns.ts"]
HD_IDX --> HD_TYPES["types.ts"]
HD_IDX --> HD_EXPAND["ExpandCell.vue"]
HD_IDX --> HD_SOURCE["SourceCell.vue"]
HD_IDX --> UTIL_SORT["tableSort/insertToOrderedArray (imported)"]
M_IDX["Matrix/index.vue"] --> M_TYPES["type.ts"]
M_IDX --> M_CELL["MatrixCell.vue"]
PT_IDX["PanelTree/index.vue"] --> PT_TYPES["type.ts"]
VL_IDX["VirtualList/index.vue"] --> VL_TYPES["types.ts"]
VL_IDX --> VL_PANEL["Panel.vue"]
CE_IDX["CellEdit/index.vue"] --> CE_TYPES["type.ts"]
CE_IDX --> CE_EDIT["EditCell.vue"]
CE_IDX --> CE_SWITCH["EditRowSwitch.vue"]
```

**Diagram sources**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L1-L14)
- [docs-demo/demos/HugeData/columns.ts](file://docs-demo/demos/HugeData/columns.ts#L1-L10)
- [docs-demo/demos/HugeData/types.ts](file://docs-demo/demos/HugeData/types.ts#L1-L52)
- [docs-demo/demos/HugeData/custom-cells/ExpandCell.vue](file://docs-demo/demos/HugeData/custom-cells/ExpandCell.vue#L1-L7)
- [docs-demo/demos/HugeData/custom-cells/SourceCell.vue](file://docs-demo/demos/HugeData/custom-cells/SourceCell.vue#L1-L4)
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L23-L28)
- [docs-demo/demos/Matrix/type.ts](file://docs-demo/demos/Matrix/type.ts#L1-L16)
- [docs-demo/demos/Matrix/MatrixCell.vue](file://docs-demo/demos/Matrix/MatrixCell.vue#L22-L25)
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue#L24-L28)
- [docs-demo/demos/PanelTree/type.ts](file://docs-demo/demos/PanelTree/type.ts#L1-L13)
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L2-L7)
- [docs-demo/demos/VirtualList/types.ts](file://docs-demo/demos/VirtualList/types.ts#L1-L6)
- [docs-demo/demos/VirtualList/Panel.vue](file://docs-demo/demos/VirtualList/Panel.vue#L1-L6)
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue#L21-L27)
- [docs-demo/demos/CellEdit/type.ts](file://docs-demo/demos/CellEdit/type.ts#L1-L15)
- [docs-demo/demos/CellEdit/EditCell.vue](file://docs-demo/demos/CellEdit/EditCell.vue#L17-L21)
- [docs-demo/demos/CellEdit/EditRowSwitch.vue](file://docs-demo/demos/CellEdit/EditRowSwitch.vue#L7-L11)

**Section sources**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L1-L14)
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L23-L28)
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue#L24-L28)
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L2-L7)
- [docs-demo/demos/CellEdit/index.vue](file://docs-demo/demos/CellEdit/index.vue#L21-L27)

## Performance Considerations
- Virtualization: Enable virtual and virtual-x for large datasets to render only visible rows and columns.
- Scroll optimization: Use scroll-row-by-row or optimized scrollbar mode for smoother dragging.
- Transform stacking: translateZ can promote compositing for better scroll performance.
- Sorting: Prefer remote sorting for very large datasets; keep local sort for moderate sizes.
- Merge cells: Use mergeCells judiciously; excessive merging can increase render complexity.
- Highlighting: Use setHighlightDimRow/setHighlightDimCell sparingly to avoid frequent re-renders.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Expanding rows does not reflect: Ensure row keys are unique and dataSource is updated immutably to trigger reactivity.
- Sorting not applied: Verify sort-field mapping and sort-type match data types.
- Highlight not visible: Confirm setHighlightDimRow/setHighlightDimCell is called after nextTick.
- Custom cell not rendering: Check customCell prop and ensure proper props forwarding.
- Virtual list misalignment: Set explicit row-height and ensure headless mode is appropriate.

**Section sources**
- [docs-demo/demos/HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue#L90-L118)
- [docs-demo/demos/Matrix/index.vue](file://docs-demo/demos/Matrix/index.vue#L81-L100)
- [docs-demo/demos/PanelTree/index.vue](file://docs-demo/demos/PanelTree/index.vue#L312-L320)
- [docs-demo/demos/VirtualList/index.vue](file://docs-demo/demos/VirtualList/index.vue#L24-L35)
- [docs-demo/demos/CellEdit/EditCell.vue](file://docs-demo/demos/CellEdit/EditCell.vue#L38-L72)

## Conclusion
These examples demonstrate how to build scalable, interactive data experiences with StkTable Vue:
- Use virtualization and scroll optimizations for huge datasets.
- Employ custom cells for rich, domain-specific rendering.
- Manage dynamic columns and merging for complex layouts.
- Implement cell editing and row-level editing modes for interactive manipulation.
- Integrate with state management and backend services by passing data-source and handling events.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices
- Live demos and downloadable code: Each demo’s index.vue file serves as a standalone example. Copy the relevant folder into your project and run the dev server.
- Step-by-step guides:
  - Huge Data: Initialize columns and data, configure virtualization, simulate updates, and toggle performance options.
  - Matrix: Define columns with custom cells, initialize data, and run periodic updates.
  - Panel Tree: Configure tree columns, provide hierarchical data, and enable row highlighting.
  - Virtual List: Provide panel-like custom cells and configure row height.
  - Cell Edit: Attach EditCell and EditRowSwitch, and bind to row data.

[No sources needed since this section provides general guidance]