# Interaction Controls

<cite>
**Referenced Files in This Document**
- [StkTable.vue](file://src/StkTable/StkTable.vue)
- [useKeyboardArrowScroll.ts](file://src/StkTable/useKeyboardArrowScroll.ts)
- [useTree.ts](file://src/StkTable/useTree.ts)
- [useRowExpand.ts](file://src/StkTable/useRowExpand.ts)
- [useCellSelection.ts](file://src/StkTable/useCellSelection.ts)
- [types/index.ts](file://src/StkTable/types/index.ts)
- [TreeNodeCell.vue](file://src/StkTable/components/TreeNodeCell.vue)
- [TriangleIcon.vue](file://src/StkTable/components/TriangleIcon.vue)
- [Seq.vue](file://docs-demo/basic/seq/Seq.vue)
- [SeqStartIndex.vue](file://docs-demo/basic/seq/SeqStartIndex.vue)
- [Checkbox.vue](file://docs-demo/basic/checkbox/Checkbox.vue)
- [Tree.vue](file://docs-demo/basic/tree/Tree.vue)
- [TreeDefaultExpandAll.vue](file://docs-demo/basic/tree/TreeDefaultExpandAll.vue)
- [TreeDefaultExpandKeys.vue](file://docs-demo/basic/tree/TreeDefaultExpandKeys.vue)
- [TreeDefaultExpandLevel.vue](file://docs-demo/basic/tree/TreeDefaultExpandLevel.vue)
- [TreeVirtualList.vue](file://docs-demo/basic/tree/TreeVirtualList.vue)
- [ScrollRowByRow.vue](file://docs-demo/basic/scroll-row-by-row/ScrollRowByRow.vue)
</cite>

## Update Summary
**Changes Made**
- Added documentation for simplified keyboard arrow scroll functionality with streamlined event listener management
- Updated keyboard navigation section to reflect improved state transitions and event handling
- Enhanced integration examples showing keyboard arrow scroll with virtual scrolling

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
This document explains the interaction controls in Stk Table Vue with a focus on:
- Sequence numbering with configurable starting indices and custom numbering schemes
- Checkbox selection for row selection and multi-selection scenarios
- Tree data structure implementation including expand/collapse behavior, default expansion options, and virtual scrolling for large tree datasets
- **Updated** Simplified keyboard arrow scroll functionality with streamlined event listener management and improved state transitions

It also provides practical examples for implementing numbered rows, checkbox selection, hierarchical tree structures, and keyboard navigation with various scrolling strategies.

## Project Structure
The interaction controls are implemented as composable modules integrated into the main table component. The table component orchestrates:
- Sequence column rendering and numbering calculation
- Tree node expansion and flattening
- Row expansion for detail rows
- Cell selection via drag and keyboard shortcuts
- **Updated** Keyboard arrow scroll with optimized event handling
- Virtual scrolling for large datasets

```mermaid
graph TB
STK["StkTable.vue"]
UKA["useKeyboardArrowScroll.ts"]
UT["useTree.ts"]
URE["useRowExpand.ts"]
UCS["useCellSelection.ts"]
TIDX["types/index.ts"]
TN["TreeNodeCell.vue"]
TRI["TriangleIcon.vue"]
STK --> UKA
STK --> UT
STK --> URE
STK --> UCS
STK --> TN
STK --> TRI
STK --> TIDX
```

**Diagram sources**
- [StkTable.vue](file://src/StkTable/StkTable.vue#L298)
- [useKeyboardArrowScroll.ts:1-115](file://src/StkTable/useKeyboardArrowScroll.ts#L1-L115)
- [useTree.ts:12-161](file://src/StkTable/useTree.ts#L12-L161)
- [useRowExpand.ts:11-88](file://src/StkTable/useRowExpand.ts#L11-L88)
- [useCellSelection.ts:42-456](file://src/StkTable/useCellSelection.ts#L42-L456)
- [TreeNodeCell.vue](file://src/StkTable/components/TreeNodeCell.vue)
- [TriangleIcon.vue](file://src/StkTable/components/TriangleIcon.vue)
- [types/index.ts:235-261](file://src/StkTable/types/index.ts#L235-L261)

**Section sources**
- [StkTable.vue](file://src/StkTable/StkTable.vue#L298)
- [useKeyboardArrowScroll.ts:1-115](file://src/StkTable/useKeyboardArrowScroll.ts#L1-L115)
- [types/index.ts:235-261](file://src/StkTable/types/index.ts#L235-L261)

## Core Components
- Sequence numbering: Implemented via a dedicated column type and a configuration option for the starting index.
- Tree controls: Managed by a tree composable that handles expand/collapse, flattening, and default expansion strategies.
- Row expansion: Supports expanding a detail row beneath a base row.
- Cell selection: Provides drag-to-select ranges, keyboard shortcuts, and auto-scroll near edges.
- **Updated** Keyboard arrow scroll: Optimized event listener management with streamlined state transitions for virtual scrolling scenarios.

**Section sources**
- [StkTable.vue:157-169](file://src/StkTable/StkTable.vue#L157-L169)
- [useKeyboardArrowScroll.ts:22-26](file://src/StkTable/useKeyboardArrowScroll.ts#L22-L26)
- [types/index.ts:235-261](file://src/StkTable/types/index.ts#L235-L261)
- [useTree.ts:12-161](file://src/StkTable/useTree.ts#L12-L161)
- [useRowExpand.ts:11-88](file://src/StkTable/useRowExpand.ts#L11-L88)
- [useCellSelection.ts:42-456](file://src/StkTable/useCellSelection.ts#L42-L456)

## Architecture Overview
The table component wires together multiple interaction modules. The sequence column reads a configuration for the starting index and computes the displayed number per row. Tree operations rely on a flattening pass that respects default expansion options. Row expansion inserts a special detail row. Cell selection tracks a selection range and applies styles during drag. **Updated** Keyboard arrow scroll integrates with virtual scrolling through optimized event listeners that activate only when the table is in virtual mode and the mouse is hovering over the table body.

```mermaid
sequenceDiagram
participant User as "User"
participant Table as "StkTable.vue"
participant KAS as "useKeyboardArrowScroll.ts"
participant Tree as "useTree.ts"
participant RowExp as "useRowExpand.ts"
participant CellSel as "useCellSelection.ts"
User->>Table : Hover over table body
Table->>KAS : Mouse enter event
User->>Table : Press arrow key
KAS->>Table : scrollTo(y, x)
Table->>Table : Update virtual scroll position
User->>Table : Click triangle icon
alt Column type is "tree-node"
Table->>Tree : toggleTreeNode(row,col)
Tree-->>Table : Emit "toggle-tree-expand"
else Column type is "expand"
Table->>RowExp : toggleExpandRow(row,col)
RowExp-->>Table : Emit "toggle-row-expand"
end
User->>Table : Drag mouse in cell
Table->>CellSel : onSelectionMouseDown(event)
CellSel-->>Table : Emits "cell-selection-change"
```

**Diagram sources**
- [StkTable.vue:918-919](file://src/StkTable/StkTable.vue#L918-L919)
- [useKeyboardArrowScroll.ts:50-62](file://src/StkTable/useKeyboardArrowScroll.ts#L50-L62)
- [useTree.ts:17-20](file://src/StkTable/useTree.ts#L17-L20)
- [useRowExpand.ts:18-21](file://src/StkTable/useRowExpand.ts#L18-L21)
- [useCellSelection.ts:137-172](file://src/StkTable/useCellSelection.ts#L137-L172)

## Detailed Component Analysis

### Sequence Numbering
Sequence numbering is implemented as a column type with a configuration option for the starting index. The table renders the sequence column by combining the configured start index with the virtualized row index.

Key behaviors:
- Column type: seq
- Config: startIndex (defaults to 0)
- Rendering: The displayed number equals startIndex + virtual row index + 1

Implementation highlights:
- Column type definition supports seq
- Sequence rendering logic uses props.seqConfig.startIndex and the computed row index
- Examples demonstrate default and custom starting indices

```mermaid
flowchart TD
Start(["Render seq column"]) --> ReadCfg["Read seqConfig.startIndex"]
ReadCfg --> ComputeIdx["Compute virtual row index"]
ComputeIdx --> CalcNum["Display = startIndex + index + 1"]
CalcNum --> End(["Done"])
```

**Diagram sources**
- [StkTable.vue:196-198](file://src/StkTable/StkTable.vue#L196-L198)
- [types/index.ts:235-241](file://src/StkTable/types/index.ts#L235-L241)

Practical examples:
- Default sequence numbering: [Seq.vue:9-15](file://docs-demo/basic/seq/Seq.vue#L9-L15)
- Custom starting index: [SeqStartIndex.vue:31-35](file://docs-demo/basic/seq/SeqStartIndex.vue#L31-L35)

**Section sources**
- [StkTable.vue:196-198](file://src/StkTable/StkTable.vue#L196-L198)
- [types/index.ts:235-241](file://src/StkTable/types/index.ts#L235-L241)
- [Seq.vue:9-15](file://docs-demo/basic/seq/Seq.vue#L9-L15)
- [SeqStartIndex.vue:31-35](file://docs-demo/basic/seq/SeqStartIndex.vue#L31-L35)

### Checkbox Selection (Row Selection and Multi-Selection)
Checkbox selection is implemented using custom header and cell renderers. The examples show:
- A checkbox column with a custom header that supports "select all" and "indeterminate" states
- Per-row checkboxes bound to a flag in the data
- Computed selections for UI feedback

Key behaviors:
- Column type: custom renderer (checkbox)
- Full selection: computed flag checks all items
- Partial selection: computed flag indicates indeterminate state
- Selected items: computed list filters items by the selection flag

```mermaid
sequenceDiagram
participant User as "User"
participant Table as "StkTable.vue"
participant Demo as "Checkbox.vue"
User->>Demo : Toggle header checkbox
Demo->>Demo : Set _isChecked on all rows
Demo-->>Table : Render with updated data
User->>Demo : Toggle row checkbox
Demo->>Demo : Update _isChecked on clicked row
Demo-->>Table : Render with updated data
```

**Diagram sources**
- [Checkbox.vue:66-81](file://docs-demo/basic/checkbox/Checkbox.vue#L66-L81)
- [Checkbox.vue:82-92](file://docs-demo/basic/checkbox/Checkbox.vue#L82-L92)

Practical example:
- Checkbox selection demo: [Checkbox.vue:60-97](file://docs-demo/basic/checkbox/Checkbox.vue#L60-L97)

**Section sources**
- [Checkbox.vue:47-58](file://docs-demo/basic/checkbox/Checkbox.vue#L47-L58)
- [Checkbox.vue:66-92](file://docs-demo/basic/checkbox/Checkbox.vue#L66-L92)

### Tree Data Structure and Expand/Collapse
Tree support is implemented by a dedicated composable that:
- Flattens hierarchical data according to expansion state
- Handles expand/collapse toggles
- Applies default expansion strategies (all, keys, or level)
- Emits events for external handling

```mermaid
flowchart TD
Init(["Initialize tree data"]) --> Detect["Detect tree columns"]
Detect --> FirstLoad["First load handling"]
FirstLoad --> ApplyDefaults{"Apply default expand?"}
ApplyDefaults --> |defaultExpandAll| ExpandAll["Mark all nodes expanded"]
ApplyDefaults --> |defaultExpandLevel| ExpandLevel["Expand up to level N"]
ApplyDefaults --> |defaultExpandKeys| ExpandKeys["Expand matching keys"]
ExpandAll --> Flatten["Flatten tree with expanded nodes"]
ExpandLevel --> Flatten
ExpandKeys --> Flatten
UserClick["User clicks tree triangle"] --> Toggle["toggleTreeNode(row,col)"]
Toggle --> UpdateState["Update node expanded state"]
UpdateState --> Emit["Emit 'toggle-tree-expand'"]
```

**Diagram sources**
- [useTree.ts:12-161](file://src/StkTable/useTree.ts#L12-L161)
- [StkTable.vue:1304-1306](file://src/StkTable/StkTable.vue#L1304-L1306)

Default expansion strategies:
- Expand all: [TreeDefaultExpandAll.vue:9-11](file://docs-demo/basic/tree/TreeDefaultExpandAll.vue#L9-L11)
- Expand by keys: [TreeDefaultExpandKeys.vue:10-12](file://docs-demo/basic/tree/TreeDefaultExpandKeys.vue#L10-L12)
- Expand by level: [TreeDefaultExpandLevel.vue:9-11](file://docs-demo/basic/tree/TreeDefaultExpandLevel.vue#L9-L11)

Tree configuration options:
- defaultExpandAll
- defaultExpandKeys
- defaultExpandLevel

**Section sources**
- [useTree.ts:12-161](file://src/StkTable/useTree.ts#L12-L161)
- [types/index.ts:255-260](file://src/StkTable/types/index.ts#L255-L260)
- [TreeDefaultExpandAll.vue:9-11](file://docs-demo/basic/tree/TreeDefaultExpandAll.vue#L9-L11)
- [TreeDefaultExpandKeys.vue:10-12](file://docs-demo/basic/tree/TreeDefaultExpandKeys.vue#L10-L12)
- [TreeDefaultExpandLevel.vue:9-11](file://docs-demo/basic/tree/TreeDefaultExpandLevel.vue#L9-L11)

### Tree Rendering and Icons
Tree rendering integrates a specialized cell component and triangle icon. The table routes triangle clicks to the tree toggle handler when the column type is tree-node.

```mermaid
classDiagram
class StkTableVue {
+triangleClick(e,row,col)
+render()
}
class TreeNodeCellVue {
+click()
}
class TriangleIconVue {
+click()
}
class useTreeTs {
+toggleTreeNode(row,col)
+flatTreeData(data)
}
StkTableVue --> TreeNodeCellVue : "renders"
StkTableVue --> TriangleIconVue : "renders"
StkTableVue --> useTreeTs : "calls"
```

**Diagram sources**
- [StkTable.vue:186-188](file://src/StkTable/StkTable.vue#L186-L188)
- [TreeNodeCell.vue](file://src/StkTable/components/TreeNodeCell.vue)
- [TriangleIcon.vue](file://src/StkTable/components/TriangleIcon.vue)
- [useTree.ts:17-20](file://src/StkTable/useTree.ts#L17-L20)

**Section sources**
- [StkTable.vue:186-188](file://src/StkTable/StkTable.vue#L186-L188)
- [TreeNodeCell.vue](file://src/StkTable/components/TreeNodeCell.vue)
- [TriangleIcon.vue](file://src/StkTable/components/TriangleIcon.vue)
- [useTree.ts:17-20](file://src/StkTable/useTree.ts#L17-L20)

### Row Expansion (Detail Rows)
Row expansion allows inserting a detail row immediately below a base row. The composable manages insertion/removal of the detail row and emits events.

Key behaviors:
- Column type: expand
- Toggle: sets/unsets the expanded state for the row
- Insertion: adds a special row marker with the original row and column reference
- Emission: fires a toggle-row-expand event

```mermaid
sequenceDiagram
participant User as "User"
participant Table as "StkTable.vue"
participant RowExp as "useRowExpand.ts"
User->>Table : Click triangle in expand column
Table->>RowExp : toggleExpandRow(row,col)
RowExp->>RowExp : Remove other expanded rows below
RowExp->>RowExp : Insert detail row marker
RowExp-->>Table : Emit "toggle-row-expand"
```

**Diagram sources**
- [StkTable.vue:1302-1306](file://src/StkTable/StkTable.vue#L1302-L1306)
- [useRowExpand.ts:18-21](file://src/StkTable/useRowExpand.ts#L18-L21)
- [useRowExpand.ts:64-72](file://src/StkTable/useRowExpand.ts#L64-L72)

**Section sources**
- [useRowExpand.ts:11-88](file://src/StkTable/useRowExpand.ts#L11-L88)

### Cell Selection (Drag-to-Select, Copy, and Auto-Scroll)
Cell selection enables:
- Drag-to-select rectangular ranges
- Shift-based extension of selection
- Keyboard shortcuts (Esc to clear, Ctrl/Cmd+C to copy)
- Auto-scroll near edges while dragging

Highlights:
- Range normalization to min/max bounds
- Selection classes applied to cells in the range
- Clipboard formatting via optional callback
- Edge detection and requestAnimationFrame-based scrolling

```mermaid
flowchart TD
MDown["Mouse down on cell"] --> SetAnchor["Set anchor cell"]
SetAnchor --> Drag["Mouse move"]
Drag --> UpdateEnd["Update selection end"]
UpdateEnd --> AutoScroll{"Near edge?"}
AutoScroll --> |Yes| RAF["Start auto-scroll loop"]
AutoScroll --> |No| Continue["Continue drag"]
RAF --> UpdateSel["Update selection from point"]
UpdateSel --> RAF
Continue --> Continue
UpMouse["Mouse up"] --> Emit["Emit 'cell-selection-change'"]
```

**Diagram sources**
- [useCellSelection.ts:137-172](file://src/StkTable/useCellSelection.ts#L137-L172)
- [useCellSelection.ts:217-282](file://src/StkTable/useCellSelection.ts#L217-L282)
- [useCellSelection.ts:333-345](file://src/StkTable/useCellSelection.ts#L333-L345)

**Section sources**
- [useCellSelection.ts:42-456](file://src/StkTable/useCellSelection.ts#L42-L456)

### Keyboard Arrow Scroll (Optimized Event Management)
**Updated** The keyboard arrow scroll functionality has been simplified with streamlined event listener management and improved state transitions. The system now uses optimized event handling that activates only when the table is in virtual mode and the mouse is hovering over the table body.

Key improvements:
- Streamlined event listener management with automatic cleanup
- Improved state transitions for mouse enter/leave detection
- Optimized keyboard event handling with better integration with area selection
- Enhanced performance through reduced event listener overhead

Integration points:
- Automatically activated when virtual scrolling is enabled
- Deactivates when area selection keyboard mode is active
- Responds to mouse hover state for keyboard activation
- Uses the scrollTo function for virtual scroll position updates

```mermaid
flowchart TD
Mount["Component Mount"] --> AddListeners["Add Event Listeners"]
AddListeners --> VirtualCheck{"Virtual Mode?"}
VirtualCheck --> |Yes| Active["Enable Keyboard Scroll"]
VirtualCheck --> |No| Inactive["Disable Keyboard Scroll"]
Active --> MouseEnter["Mouse Enter Table"]
MouseEnter --> KeyboardEvent["Keyboard Event"]
KeyboardEvent --> PreventDefault["Prevent Default Behavior"]
PreventDefault --> CalculateScroll["Calculate Scroll Position"]
CalculateScroll --> CallScrollTo["Call scrollTo()"]
CallScrollTo --> UpdateVirtual["Update Virtual Scroll"]
Inactive --> RemoveListeners["Remove Event Listeners"]
RemoveListeners --> AddListeners
```

**Diagram sources**
- [useKeyboardArrowScroll.ts:37-48](file://src/StkTable/useKeyboardArrowScroll.ts#L37-L48)
- [useKeyboardArrowScroll.ts:50-62](file://src/StkTable/useKeyboardArrowScroll.ts#L50-L62)
- [useKeyboardArrowScroll.ts:65-99](file://src/StkTable/useKeyboardArrowScroll.ts#L65-L99)

**Section sources**
- [useKeyboardArrowScroll.ts:22-26](file://src/StkTable/useKeyboardArrowScroll.ts#L22-L26)
- [useKeyboardArrowScroll.ts:37-48](file://src/StkTable/useKeyboardArrowScroll.ts#L37-L48)
- [useKeyboardArrowScroll.ts:50-62](file://src/StkTable/useKeyboardArrowScroll.ts#L50-L62)
- [useKeyboardArrowScroll.ts:65-99](file://src/StkTable/useKeyboardArrowScroll.ts#L65-L99)

### Example Implementations
- Numbered rows:
  - Default sequence: [Seq.vue:9-15](file://docs-demo/basic/seq/Seq.vue#L9-L15)
  - Custom start index: [SeqStartIndex.vue:31-35](file://docs-demo/basic/seq/SeqStartIndex.vue#L31-L35)
- Checkbox selection:
  - [Checkbox.vue:60-97](file://docs-demo/basic/checkbox/Checkbox.vue#L60-L97)
- Hierarchical tree structures:
  - Basic tree: [Tree.vue:10-15](file://docs-demo/basic/tree/Tree.vue#L10-L15)
  - Expand all: [TreeDefaultExpandAll.vue:9-11](file://docs-demo/basic/tree/TreeDefaultExpandAll.vue#L9-L11)
  - Expand by keys: [TreeDefaultExpandKeys.vue:10-12](file://docs-demo/basic/tree/TreeDefaultExpandKeys.vue#L10-L12)
  - Expand by level: [TreeDefaultExpandLevel.vue:9-11](file://docs-demo/basic/tree/TreeDefaultExpandLevel.vue#L9-L11)
  - Large tree with virtual scrolling: [TreeVirtualList.vue:56-63](file://docs-demo/basic/tree/TreeVirtualList.vue#L56-L63)
- **Updated** Keyboard navigation:
  - Virtual scrolling with keyboard arrow support: [ScrollRowByRow.vue](file://docs-demo/basic/scroll-row-by-row/ScrollRowByRow.vue)

**Section sources**
- [Seq.vue:9-15](file://docs-demo/basic/seq/Seq.vue#L9-L15)
- [SeqStartIndex.vue:31-35](file://docs-demo/basic/seq/SeqStartIndex.vue#L31-L35)
- [Checkbox.vue:60-97](file://docs-demo/basic/checkbox/Checkbox.vue#L60-L97)
- [Tree.vue:10-15](file://docs-demo/basic/tree/Tree.vue#L10-L15)
- [TreeDefaultExpandAll.vue:9-11](file://docs-demo/basic/tree/TreeDefaultExpandAll.vue#L9-L11)
- [TreeDefaultExpandKeys.vue:10-12](file://docs-demo/basic/tree/TreeDefaultExpandKeys.vue#L10-L12)
- [TreeDefaultExpandLevel.vue:9-11](file://docs-demo/basic/tree/TreeDefaultExpandLevel.vue#L9-L11)
- [TreeVirtualList.vue:56-63](file://docs-demo/basic/tree/TreeVirtualList.vue#L56-L63)
- [ScrollRowByRow.vue](file://docs-demo/basic/scroll-row-by-row/ScrollRowByRow.vue)

## Dependency Analysis
The table component composes multiple interaction modules. The sequence column depends on configuration; tree operations depend on default expansion options; row expansion and cell selection operate independently but integrate through the table's event system. **Updated** Keyboard arrow scroll integrates with virtual scrolling through optimized event listeners that manage their own lifecycle based on virtual mode activation.

```mermaid
graph LR
STK["StkTable.vue"]
KAS["useKeyboardArrowScroll.ts"]
SEQ["seq column"]
TREE["useTree.ts"]
REXP["useRowExpand.ts"]
CSEL["useCellSelection.ts"]
TYPES["types/index.ts"]
STK --> KAS
STK --> SEQ
STK --> TREE
STK --> REXP
STK --> CSEL
STK --> TYPES
```

**Diagram sources**
- [StkTable.vue](file://src/StkTable/StkTable.vue#L298)
- [useKeyboardArrowScroll.ts:1-115](file://src/StkTable/useKeyboardArrowScroll.ts#L1-L115)
- [types/index.ts:235-261](file://src/StkTable/types/index.ts#L235-L261)

**Section sources**
- [StkTable.vue](file://src/StkTable/StkTable.vue#L298)
- [useKeyboardArrowScroll.ts:1-115](file://src/StkTable/useKeyboardArrowScroll.ts#L1-L115)
- [types/index.ts:235-261](file://src/StkTable/types/index.ts#L235-L261)

## Performance Considerations
- Virtual scrolling is essential for large tree datasets. The tree flattening occurs once per data initialization and during sorting to keep the dataset linear for the virtualizer.
- Auto-scroll during drag selection uses requestAnimationFrame to avoid layout thrashing.
- Row height can be customized for expanded rows in virtual mode to maintain accurate virtualization.
- **Updated** Keyboard arrow scroll uses optimized event listener management that automatically cleans up when virtual mode is disabled, reducing memory overhead and improving performance.

## Troubleshooting Guide
Common issues and resolutions:
- Tree expand failures: The tree composable logs warnings when a row key is not found during expansion attempts. Ensure row keys are present and match the configured row key generator.
- Unexpected selection clearing: Keyboard shortcut Esc clears the selection. Verify that the table container has focus if you rely on keyboard shortcuts.
- Multi-level headers with horizontal virtualization: Multi-level headers are not supported with horizontal virtualization; the table logs an error to prevent invalid configurations.
- **Updated** Keyboard arrow scroll not working: Ensure the table is in virtual mode and the mouse is hovering over the table body. The keyboard scroll functionality is designed to activate only under these conditions to prevent conflicts with other interactions.

**Section sources**
- [useTree.ts:42-45](file://src/StkTable/useTree.ts#L42-L45)
- [useCellSelection.ts:361-366](file://src/StkTable/useCellSelection.ts#L361-L366)
- [StkTable.vue:965-967](file://src/StkTable/StkTable.vue#L965-L967)
- [useKeyboardArrowScroll.ts:22-26](file://src/StkTable/useKeyboardArrowScroll.ts#L22-L26)

## Conclusion
Stk Table Vue provides robust interaction controls:
- Sequence numbering is flexible with a configurable starting index
- Tree structures support expand/collapse, default expansion strategies, and virtual scrolling for large datasets
- Row expansion and cell selection offer ergonomic UX patterns
- **Updated** Keyboard arrow scroll provides optimized virtual scrolling with streamlined event management and improved state transitions
- The modular architecture keeps these features cohesive and easy to configure

## Appendices
- Configuration reference:
  - Sequence: startIndex
  - Tree: defaultExpandAll, defaultExpandKeys, defaultExpandLevel
- Events:
  - toggle-tree-expand
  - toggle-row-expand
  - cell-selection-change
- **Updated** Keyboard navigation:
  - Arrow keys: Up, Down, Left, Right
  - Page navigation: PageUp, PageDown
  - Position control: Home, End
  - Activation conditions: Virtual mode enabled, mouse hover over table body

**Section sources**
- [types/index.ts:235-261](file://src/StkTable/types/index.ts#L235-L261)
- [StkTable.vue:604-616](file://src/StkTable/StkTable.vue#L604-L616)
- [useKeyboardArrowScroll.ts:5-15](file://src/StkTable/useKeyboardArrowScroll.ts#L5-L15)