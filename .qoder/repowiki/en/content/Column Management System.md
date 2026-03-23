# Column Management System

<cite>
**Referenced Files in This Document**
- [useTableColumns.ts](file://src/StkTable/useTableColumns.ts)
- [useColResize.ts](file://src/StkTable/useColResize.ts)
- [useFixedCol.ts](file://src/StkTable/useFixedCol.ts)
- [useFixedStyle.ts](file://src/StkTable/useFixedStyle.ts)
- [useGetFixedColPosition.ts](file://src/StkTable/useGetFixedColPosition.ts)
- [constRefUtils.ts](file://src/StkTable/utils/constRefUtils.ts)
- [index.ts](file://src/StkTable/types/index.ts)
- [ColResizable.vue](file://docs-demo/advanced/column-resize/ColResizable.vue)
- [ColumnWidth.vue](file://docs-demo/basic/column-width/ColumnWidth.vue)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Column Processing Engine](#column-processing-engine)
5. [Column Resizing System](#column-resizing-system)
6. [Fixed Column Management](#fixed-column-management)
7. [Column Width Calculation](#column-width-calculation)
8. [Integration Examples](#integration-examples)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Conclusion](#conclusion)

## Introduction

The Column Management System is a comprehensive solution for handling table columns in the StkTable Vue component library. This system manages column configuration, multi-level header processing, column resizing, fixed columns, and responsive column width calculations. It provides a robust foundation for building complex table interfaces with advanced column manipulation capabilities.

The system is designed to handle various column scenarios including simple single-level headers, complex multi-level headers, resizable columns, fixed-positioned columns, and virtual scrolling environments. It ensures optimal performance while maintaining flexibility for different use cases.

## System Architecture

The Column Management System follows a modular architecture with clear separation of concerns:

```mermaid
graph TB
subgraph "Column Management Core"
A[useTableColumns] --> B[Column Processing Engine]
C[useColResize] --> D[Column Resizing System]
E[useFixedCol] --> F[Fixed Column Manager]
G[useFixedStyle] --> H[Fixed Style Generator]
I[useGetFixedColPosition] --> J[Position Calculator]
end
subgraph "Utility Layer"
K[constRefUtils] --> L[Width Calculations]
M[index.ts] --> N[Type Definitions]
end
subgraph "Demo Integration"
O[ColResizable.vue] --> P[Live Examples]
Q[ColumnWidth.vue] --> R[Usage Patterns]
end
B --> L
D --> L
F --> J
H --> J
L --> N
```

**Diagram sources**
- [useTableColumns.ts](file://src/StkTable/useTableColumns.ts#L15-L137)
- [useColResize.ts](file://src/StkTable/useColResize.ts#L29-L214)
- [useFixedCol.ts](file://src/StkTable/useFixedCol.ts#L19-L155)

## Core Components

### Column Processing Engine

The Column Processing Engine serves as the central hub for all column-related operations. It handles multi-level header processing, column flattening, and maintains the relationship between parent and child columns.

```mermaid
classDiagram
class ColumnProcessor {
+tableHeaders : Ref[]
+tableHeadersForCalc : Ref[]
+dealColumns(columns) : void
+flat(arr, parent, depth) : [number, number]
+calculateDimensions() : void
}
class ColumnNode {
+key : any
+dataIndex : string
+title : string
+width : string|number
+fixed : 'left'|'right'|null
+children : ColumnNode[]
+__PARENT__ : ColumnNode
+__WIDTH__ : number
+__R_SP__ : number
+__C_SP__ : number
}
class HeaderRow {
+depth : number
+columns : ColumnNode[]
+rowSpan : number
+colSpan : number
}
ColumnProcessor --> HeaderRow : creates
HeaderRow --> ColumnNode : contains
ColumnNode --> ColumnNode : parent-child relationship
```

**Diagram sources**
- [useTableColumns.ts](file://src/StkTable/useTableColumns.ts#L38-L130)
- [index.ts](file://src/StkTable/types/index.ts#L54-L138)

**Section sources**
- [useTableColumns.ts](file://src/StkTable/useTableColumns.ts#L15-L137)
- [index.ts](file://src/StkTable/types/index.ts#L54-L138)

### Column Resizing System

The Column Resizing System provides interactive column width adjustment capabilities with support for both left and right resize handles, minimum width constraints, and visual feedback during resizing operations.

```mermaid
sequenceDiagram
participant User as User Interaction
participant ResizeHook as useColResize
participant Table as Table Container
participant Indicator as Resize Indicator
participant Events as Event System
User->>ResizeHook : Mouse Down on Resize Handle
ResizeHook->>Table : Get Container Position
ResizeHook->>ResizeHook : Calculate Resize State
ResizeHook->>Indicator : Show Visual Feedback
Events->>ResizeHook : Mouse Move Event
ResizeHook->>Indicator : Update Position
Events->>ResizeHook : Mouse Up Event
ResizeHook->>Table : Update Column Width
ResizeHook->>Events : Emit Resize Event
ResizeHook->>Indicator : Hide Visual Feedback
```

**Diagram sources**
- [useColResize.ts](file://src/StkTable/useColResize.ts#L83-L198)

**Section sources**
- [useColResize.ts](file://src/StkTable/useColResize.ts#L29-L214)

### Fixed Column Management

The Fixed Column Management system handles the positioning, styling, and shadow effects of fixed columns in both normal and virtual scrolling modes.

```mermaid
flowchart TD
Start([Fixed Column Processing]) --> CheckMode{Check Scroll Mode}
CheckMode --> |Normal Scroll| NormalCalc[Calculate Fixed Positions]
CheckMode --> |Virtual Scroll| VirtualCalc[Calculate Virtual Positions]
NormalCalc --> LeftCols[Process Left Fixed Columns]
NormalCalc --> RightCols[Process Right Fixed Columns]
VirtualCalc --> LeftVirtual[Process Left Virtual Fixed]
VirtualCalc --> RightVirtual[Process Right Virtual Fixed]
LeftCols --> PositionCalc[Calculate Position Values]
RightCols --> PositionCalc
LeftVirtual --> PositionCalc
RightVirtual --> PositionCalc
PositionCalc --> ShadowCalc[Calculate Shadow Effects]
ShadowCalc --> StyleApply[Apply Fixed Styles]
StyleApply --> End([Fixed Columns Ready])
```

**Diagram sources**
- [useFixedCol.ts](file://src/StkTable/useFixedCol.ts#L91-L145)
- [useFixedStyle.ts](file://src/StkTable/useFixedStyle.ts#L34-L72)

**Section sources**
- [useFixedCol.ts](file://src/StkTable/useFixedCol.ts#L19-L155)
- [useFixedStyle.ts](file://src/StkTable/useFixedStyle.ts#L19-L75)

## Column Processing Engine

### Multi-Level Header Processing

The system supports complex multi-level header structures with automatic row span and column span calculation. The processing algorithm uses a depth-first search approach to traverse nested column configurations.

```mermaid
flowchart TD
Input[Input Columns Array] --> Validate{Validate Input}
Validate --> |Valid| CalcDepth[Calculate Header Depth]
Validate --> |Invalid| Error[Throw Error]
CalcDepth --> InitArrays[Initialize Header Arrays]
InitArrays --> DFS[Depth-First Search]
DFS --> ProcessNode[Process Current Node]
ProcessNode --> HasChildren{Has Children?}
HasChildren --> |Yes| Recurse[Recurse to Children]
HasChildren --> |No| CalcLeaf[Calculate Leaf Width]
Recurse --> Backtrack[Backtrack to Parent]
CalcLeaf --> Backtrack
Backtrack --> UpdateStats[Update Width Statistics]
UpdateStats --> NextNode[Process Next Node]
NextNode --> DFS
DFS --> Complete[Complete Processing]
Complete --> Output[Output Processed Headers]
```

**Diagram sources**
- [useTableColumns.ts](file://src/StkTable/useTableColumns.ts#L80-L125)

### Column Flattening Algorithm

The column flattening process transforms hierarchical column configurations into flat arrays organized by header depth level, enabling efficient rendering and positioning calculations.

**Section sources**
- [useTableColumns.ts](file://src/StkTable/useTableColumns.ts#L38-L130)

## Column Resizing System

### Resize State Management

The resize system maintains comprehensive state information including current resizing column, mouse position tracking, and resize direction calculations.

```mermaid
classDiagram
class ColResizeState {
+currentCol : StkTableColumn
+lastCol : StkTableColumn
+startX : number
+startOffsetTableX : number
+revertMoveX : boolean
}
class ResizeConfig {
+disabled : Function
+minWidth : number
+maxWidth : number
}
class ResizeEventHandlers {
+onThResizeMouseDown(MouseEvent, StkTableColumn, boolean) : void
+onThResizeMouseMove(MouseEvent) : void
+onThResizeMouseUp(MouseEvent) : void
+initColResizeEvent() : void
+clearColResizeEvent() : void
}
ColResizeState --> ResizeEventHandlers : manages
ResizeConfig --> ResizeEventHandlers : configures
```

**Diagram sources**
- [useColResize.ts](file://src/StkTable/useColResize.ts#L5-L48)
- [useColResize.ts](file://src/StkTable/useColResize.ts#L83-L198)

### Resize Constraints and Validation

The system enforces strict width constraints ensuring columns maintain minimum and maximum width limits during resizing operations.

**Section sources**
- [useColResize.ts](file://src/StkTable/useColResize.ts#L141-L198)

## Fixed Column Management

### Position Calculation System

The fixed column positioning system calculates precise positions for columns in both normal and virtual scrolling scenarios, accounting for scroll offsets and container dimensions.

```mermaid
graph LR
subgraph "Position Calculation Flow"
A[Column List] --> B[Left-to-Right Pass]
B --> C[Accumulate Left Offsets]
C --> D[Store Left Positions]
A --> E[Right-to-Left Pass]
E --> F[Find Right Start Index]
F --> G[Accumulate Right Offsets]
G --> H[Store Right Positions]
D --> I[Final Position Map]
H --> I
end
```

**Diagram sources**
- [useGetFixedColPosition.ts](file://src/StkTable/useGetFixedColPosition.ts#L23-L61)

**Section sources**
- [useFixedCol.ts](file://src/StkTable/useFixedCol.ts#L91-L145)
- [useFixedStyle.ts](file://src/StkTable/useFixedStyle.ts#L34-L72)
- [useGetFixedColPosition.ts](file://src/StkTable/useGetFixedColPosition.ts#L15-L65)

## Column Width Calculation

### Width Resolution Strategy

The width calculation system implements a sophisticated resolution strategy that prioritizes appropriate width values based on the current table mode and configuration.

```mermaid
flowchart TD
Start([Calculate Column Width]) --> CheckMode{Check Table Mode}
CheckMode --> |Virtual X| VirtualPath[Use minWidth Priority]
CheckMode --> |Normal| NormalPath[Use width Priority]
VirtualPath --> CheckMinWidth{Has minWidth?}
NormalPath --> CheckWidth{Has width?}
CheckMinWidth --> |Yes| UseMinWidth[Use minWidth]
CheckMinWidth --> |No| CheckWidthFallback{Has width?}
CheckWidth --> |Yes| UseWidth[Use width]
CheckWidth --> |No| UseDefault[Use DEFAULT_COL_WIDTH]
UseMinWidth --> End([Return Width])
UseWidth --> End
UseDefault --> End
CheckWidthFallback --> |Yes| UseWidth
CheckWidthFallback --> |No| UseDefault
```

**Diagram sources**
- [constRefUtils.ts](file://src/StkTable/utils/constRefUtils.ts#L9-L20)

**Section sources**
- [constRefUtils.ts](file://src/StkTable/utils/constRefUtils.ts#L1-L30)

## Integration Examples

### Live Resizing Demo

The column resizing functionality is demonstrated through a comprehensive live demo showcasing real-time column width adjustments with visual feedback and persistent state updates.

**Section sources**
- [ColResizable.vue](file://docs-demo/advanced/column-resize/ColResizable.vue#L1-L46)

### Column Width Configuration

The basic column width demonstration showcases various width configuration options including fixed widths, maximum width constraints, and responsive behavior in virtual scrolling environments.

**Section sources**
- [ColumnWidth.vue](file://docs-demo/basic/column-width/ColumnWidth.vue#L1-L46)

## Performance Considerations

### Optimized Rendering Pipeline

The column management system implements several performance optimizations including:

- **Lazy Evaluation**: Computed properties and reactive references minimize unnecessary recalculations
- **Efficient Data Structures**: Shallow refs and optimized arrays reduce memory overhead
- **Batch Updates**: Grouped operations prevent excessive re-renders
- **Constraint Validation**: Early exit conditions avoid redundant processing

### Memory Management

The system employs careful memory management strategies:

- **WeakMap Usage**: Reference-based storage for internal relationships
- **Computed Caching**: Memoized calculations prevent repeated computations
- **Event Cleanup**: Proper event listener management prevents memory leaks

## Troubleshooting Guide

### Common Issues and Solutions

**Multi-level Header Limitations**
- Issue: Multi-level headers not supported with horizontal virtual scrolling
- Solution: Disable horizontal virtual scrolling when using complex headers

**Fixed Column Positioning**
- Issue: Fixed columns not appearing in expected positions
- Solution: Verify column ordering and ensure proper fixed property assignment

**Resize Handle Conflicts**
- Issue: Resize handles not responding to mouse events
- Solution: Check colResizable configuration and ensure proper event binding

**Width Calculation Errors**
- Issue: Unexpected column widths in virtual mode
- Solution: Verify minWidth vs width priority and default value fallbacks

**Section sources**
- [useTableColumns.ts](file://src/StkTable/useTableColumns.ts#L65-L67)
- [useColResize.ts](file://src/StkTable/useColResize.ts#L151-L153)

## Conclusion

The Column Management System provides a comprehensive solution for handling complex table column scenarios in modern web applications. Its modular architecture, robust processing engine, and extensive configuration options make it suitable for a wide range of use cases from simple data tables to complex analytical interfaces.

The system's emphasis on performance, accessibility, and developer experience ensures reliable operation across diverse environments while maintaining flexibility for customization. The integration with Vue's reactivity system enables seamless updates and optimal rendering performance.

Future enhancements could include additional column manipulation features, enhanced keyboard navigation support, and expanded customization options for advanced use cases.