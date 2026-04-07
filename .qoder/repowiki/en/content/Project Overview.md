# Project Overview

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [LICENSE](file://LICENSE)
- [index.md](file://docs-src/index.md)
- [start.md](file://docs-src/main/start/start.md)
- [vue2-usage.md](file://docs-src/main/start/vue2-usage.md)
- [basic.md](file://docs-src/main/table/basic/basic.md)
- [StkTable.vue](file://src/StkTable/StkTable.vue)
- [index.ts](file://src/StkTable/index.ts)
- [useVirtualScroll.ts](file://src/StkTable/useVirtualScroll.ts)
- [useHighlight.ts](file://src/StkTable/useHighlight.ts)
- [useColResize.ts](file://src/StkTable/useColResize.ts)
- [useTree.ts](file://src/StkTable/useTree.ts)
- [useMergeCells.ts](file://src/StkTable/useMergeCells.ts)
- [types/index.ts](file://src/StkTable/types/index.ts)
- [CHANGELOG.md](file://CHANGELOG.md)
</cite>

## Update Summary
**Changes Made**
- Updated package metadata section to reflect standardized author (japlus), MIT license clarification, and improved repository configuration
- Enhanced documentation with comprehensive keyword reorganization for better discoverability
- Updated licensing information and project metadata presentation
- Maintained all existing architectural and feature documentation while adding metadata improvements

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
Stk Table Vue (also referred to as Sticky Table) is a high-performance virtual table component library designed for real-time data display. Its core value proposition lies in delivering smooth, responsive experiences for large datasets while maintaining a lightweight footprint. The library emphasizes:
- Real-time and dynamic data scenarios (e.g., live feeds, dashboards)
- High-performance rendering via virtual scrolling (vertical, horizontal, and mixed)
- Dual Vue 2.7/3.x compatibility for broad adoption
- Advanced UX features such as highlighting, resizable columns, tree tables, and merged cells

Key differentiators:
- Built-in virtualization for both axes with intelligent viewport management
- Integrated highlighting system for rows and cells with configurable animation or CSS modes
- Rich column management including custom cells, sortable headers, fixed columns, and resizable columns
- Tree table support and merged cells for complex layouts
- First-class TypeScript support and reactive configuration

Target use cases:
- Financial dashboards and market data displays
- Monitoring and analytics panels
- Large tabular datasets requiring smooth scrolling and frequent updates
- Applications needing advanced column behaviors (sorting, resizing, merging, tree expansion)

Installation and quick start are documented in the official documentation and examples included in this repository.

**Section sources**
- [README.md:15-19](file://README.md#L15-L19)
- [index.md:23-43](file://docs-src/index.md#L23-L43)
- [CHANGELOG.md:1-200](file://CHANGELOG.md#L1-L200)

## Project Structure
The repository is organized around a modular Vue 3 composition-based architecture with a focus on virtualization and advanced table features. The core component and supporting composables are located under src/StkTable, while documentation and demos are under docs-src and docs-demo respectively.

```mermaid
graph TB
subgraph "Library Core"
STK["StkTable.vue"]
IDX["index.ts"]
TYPES["types/index.ts"]
end
subgraph "Composables"
VS["useVirtualScroll.ts"]
HL["useHighlight.ts"]
CR["useColResize.ts"]
TR["useTree.ts"]
MC["useMergeCells.ts"]
end
subgraph "Docs and Demos"
DOC_HOME["docs-src/index.md"]
START["docs-src/main/start/start.md"]
BASIC["docs-src/main/table/basic/basic.md"]
end
STK --> VS
STK --> HL
STK --> CR
STK --> TR
STK --> MC
STK --> TYPES
IDX --> STK
DOC_HOME --> START
DOC_HOME --> BASIC
```

**Diagram sources**
- [StkTable.vue:1-200](file://src/StkTable/StkTable.vue#L1-L200)
- [index.ts:1-5](file://src/StkTable/index.ts#L1-L5)
- [useVirtualScroll.ts:1-200](file://src/StkTable/useVirtualScroll.ts#L1-L200)
- [useHighlight.ts:1-200](file://src/StkTable/useHighlight.ts#L1-L200)
- [useColResize.ts:1-200](file://src/StkTable/useColResize.ts#L1-L200)
- [useTree.ts:1-162](file://src/StkTable/useTree.ts#L1-L162)
- [useMergeCells.ts:1-122](file://src/StkTable/useMergeCells.ts#L1-L122)
- [index.md:1-46](file://docs-src/index.md#L1-L46)
- [start.md:1-77](file://docs-src/main/start/start.md#L1-L77)
- [basic.md:1-41](file://docs-src/main/table/basic/basic.md#L1-L41)

**Section sources**
- [index.ts:1-5](file://src/StkTable/index.ts#L1-L5)
- [StkTable.vue:1-200](file://src/StkTable/StkTable.vue#L1-L200)
- [index.md:1-46](file://docs-src/index.md#L1-L46)

## Core Components
- StkTable.vue: The primary table component implementing rendering, virtual scrolling, highlighting, column management, and event emissions.
- useVirtualScroll.ts: Provides virtual scrolling state and calculations for both vertical and horizontal axes, including dynamic page size and offset management.
- useHighlight.ts: Implements row and cell highlighting with animation or CSS-based modes, supporting theme-aware colors and configurable durations/frequencies.
- useColResize.ts: Enables interactive column resizing with visual indicators, min/max constraints, and reactive updates to column widths.
- useTree.ts: Adds tree table capabilities including expand/collapse, default expansion policies, and flattened data management.
- useMergeCells.ts: Handles merged cells logic for rowspan/colspan, including hover/active state propagation across merged regions.
- types/index.ts: Defines comprehensive TypeScript types for columns, sorting, merging, tree configuration, and other features.

These components work together to deliver a cohesive, high-performance table experience with advanced customization.

**Section sources**
- [StkTable.vue:209-621](file://src/StkTable/StkTable.vue#L209-L621)
- [useVirtualScroll.ts:1-200](file://src/StkTable/useVirtualScroll.ts#L1-L200)
- [useHighlight.ts:1-200](file://src/StkTable/useHighlight.ts#L1-L200)
- [useColResize.ts:1-200](file://src/StkTable/useColResize.ts#L1-L200)
- [useTree.ts:1-162](file://src/StkTable/useTree.ts#L1-L162)
- [useMergeCells.ts:1-122](file://src/StkTable/useMergeCells.ts#L1-L122)
- [types/index.ts:1-200](file://src/StkTable/types/index.ts#L1-L200)

## Architecture Overview
The architecture follows a composition-driven design:
- StkTable.vue orchestrates rendering and delegates specialized behaviors to composable modules.
- Composables encapsulate cross-cutting concerns (virtualization, highlighting, resizing, tree, merging) and expose reactive state and methods.
- Types provide strong typing for props, events, and internal structures.

```mermaid
graph TB
STK["StkTable.vue"]
VS["useVirtualScroll"]
HL["useHighlight"]
CR["useColResize"]
TR["useTree"]
MC["useMergeCells"]
TYPES["types/index.ts"]
STK --> VS
STK --> HL
STK --> CR
STK --> TR
STK --> MC
STK --> TYPES
```

**Diagram sources**
- [StkTable.vue:209-621](file://src/StkTable/StkTable.vue#L209-L621)
- [useVirtualScroll.ts:1-200](file://src/StkTable/useVirtualScroll.ts#L1-L200)
- [useHighlight.ts:1-200](file://src/StkTable/useHighlight.ts#L1-L200)
- [useColResize.ts:1-200](file://src/StkTable/useColResize.ts#L1-L200)
- [useTree.ts:1-162](file://src/StkTable/useTree.ts#L1-L162)
- [useMergeCells.ts:1-122](file://src/StkTable/useMergeCells.ts#L1-L122)
- [types/index.ts:1-200](file://src/StkTable/types/index.ts#L1-L200)

## Detailed Component Analysis

### Virtual Scrolling
Virtual scrolling ensures smooth rendering of large datasets by only rendering visible rows and columns. The implementation computes viewport boundaries, manages page sizes, and adjusts offsets for both vertical and horizontal scrolling.

```mermaid
flowchart TD
Start(["Scroll Event"]) --> Compute["Compute Viewport Indices"]
Compute --> UpdateState["Update Virtual Store<br/>startIndex/endIndex/offsetTop/offsetLeft"]
UpdateState --> Render["Render Visible Rows/Columns"]
Render --> End(["Done"])
```

**Diagram sources**
- [useVirtualScroll.ts:100-176](file://src/StkTable/useVirtualScroll.ts#L100-L176)

**Section sources**
- [useVirtualScroll.ts:1-200](file://src/StkTable/useVirtualScroll.ts#L1-L200)
- [StkTable.vue:763-788](file://src/StkTable/StkTable.vue#L763-L788)

### Highlighting System
The highlighting system supports animated or CSS-based row and cell highlights with configurable keyframes, duration, and theme-aware colors. It integrates with virtual scrolling and uses requestAnimationFrame for smooth animations.

```mermaid
sequenceDiagram
participant App as "App"
participant Comp as "StkTable.vue"
participant HL as "useHighlight.ts"
App->>Comp : setHighlightDimRow(keys, options)
Comp->>HL : setHighlightDimRow(keys, options)
HL->>HL : compute keyframes/duration
HL->>HL : animate rows (Element.animate or CSS)
HL-->>Comp : completion
Comp-->>App : done
```

**Diagram sources**
- [useHighlight.ts:109-166](file://src/StkTable/useHighlight.ts#L109-L166)
- [StkTable.vue:253-253](file://src/StkTable/StkTable.vue#L253-L253)

**Section sources**
- [useHighlight.ts:1-200](file://src/StkTable/useHighlight.ts#L1-L200)
- [StkTable.vue:253-253](file://src/StkTable/StkTable.vue#L253-L253)

### Column Resizing
Interactive column resizing allows users to adjust column widths with visual feedback. The implementation tracks mouse movement, enforces minimum widths, and emits updates to the column configuration.

```mermaid
flowchart TD
MDown["Mouse Down on Resizer"] --> Init["Initialize Resize State"]
Init --> Move["Mouse Move"]
Move --> UpdatePos["Update Indicator Position"]
MUp["Mouse Up"] --> Apply["Apply New Width"]
Apply --> Emit["Emit update:columns and col-resize"]
Emit --> Done(["Done"])
```

**Diagram sources**
- [useColResize.ts:83-198](file://src/StkTable/useColResize.ts#L83-L198)

**Section sources**
- [useColResize.ts:1-200](file://src/StkTable/useColResize.ts#L1-L200)
- [StkTable.vue:249-249](file://src/StkTable/StkTable.vue#L249-L249)

### Tree Table
Tree table support enables hierarchical data display with expand/collapse controls. It flattens data for rendering while preserving node relationships and expansion states.

```mermaid
flowchart TD
Load["Load Data"] --> Flatten["Flatten Tree Data"]
Flatten --> Toggle["Toggle Node Expansion"]
Toggle --> Update["Update Expansion State"]
Update --> Render["Render Flattened Rows"]
```

**Diagram sources**
- [useTree.ts:121-125](file://src/StkTable/useTree.ts#L121-L125)

**Section sources**
- [useTree.ts:1-162](file://src/StkTable/useTree.ts#L1-L162)
- [StkTable.vue:262-262](file://src/StkTable/StkTable.vue#L262-L262)

### Merged Cells
Merged cells support rowspan/colspan with hidden-cell logic to avoid overlapping renders. Hover and active states propagate across merged regions for consistent UX.

```mermaid
flowchart TD
Calc["Calculate Merge Dimensions"] --> Hide["Hide Covered Cells"]
Hide --> Hover["Update Hover/Active Merged Cells"]
Hover --> Render["Render Merged Regions"]
```

**Diagram sources**
- [useMergeCells.ts:66-97](file://src/StkTable/useMergeCells.ts#L66-L97)

**Section sources**
- [useMergeCells.ts:1-122](file://src/StkTable/useMergeCells.ts#L1-L122)
- [StkTable.vue:794-800](file://src/StkTable/StkTable.vue#L794-L800)

## Dependency Analysis
The library's package metadata indicates a modern build pipeline with TypeScript, Vite, and VitePress for documentation. The main entry exports the StkTable component and related utilities, with styles imported via the index.

```mermaid
graph TB
PKG["package.json"]
LIB["lib/stk-table-vue.js"]
SRC["src/StkTable/index.ts"]
STYLES["lib/style.css"]
PKG --> LIB
SRC --> LIB
SRC --> STYLES
```

**Diagram sources**
- [package.json:1-76](file://package.json#L1-L76)
- [index.ts:1-5](file://src/StkTable/index.ts#L1-L5)

**Section sources**
- [package.json:1-76](file://package.json#L1-L76)
- [index.ts:1-5](file://src/StkTable/index.ts#L1-L5)

## Performance Considerations
- Virtual scrolling reduces DOM nodes to visible items, minimizing layout and paint costs.
- Auto row height and merged cells require additional computations; use them judiciously for very large datasets.
- Custom scrollbar and scroll-row-by-row modes help mitigate white-screen issues during fast scrolling.
- Column resizing recalculates widths; prefer fixed widths for horizontal virtual lists to reduce layout thrash.

## Package Metadata and Licensing

### Author Standardization
The project maintains consistent author identification under the standardized "japlus" moniker, ensuring clear attribution and project recognition across all distribution channels.

### MIT License Clarification
The project operates under the MIT License, providing:
- Permission to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
- Full commercial and non-commercial usage rights
- Clear patent grant and liability disclaimer
- Simple attribution requirements

### Repository Configuration
The repository is structured with:
- Primary GitHub repository: https://github.com/ja-plus/stk-table-vue
- Alternative Gitee mirror: https://gitee.com/japlus/stk-table-vue
- Comprehensive issue tracking and contribution workflow
- Multi-language documentation support (English, Japanese, Korean, Chinese)

### Keyword Reorganization for Discoverability
The package includes a comprehensive keyword list optimized for search engine discoverability:
- Core technologies: vue, vue-table, virtual table, virtual-scroll, data-table
- Framework compatibility: vue2, vue3, vue-component
- Feature keywords: highlight, sticky, virtual, list, grid
- Use case descriptors: table, grid, list, component

**Section sources**
- [package.json:8-9](file://package.json#L8-L9)
- [LICENSE:1-22](file://LICENSE#L1-L22)
- [README.md:28-31](file://README.md#L28-L31)

## Troubleshooting Guide
Common issues and resolutions:
- Empty data state: Ensure showNoData and noDataFull are configured appropriately; customize the empty slot for clarity.
- Scroll behavior anomalies: Adjust smoothScroll and scrollRowByRow settings; verify row heights and headerRowHeight.
- Highlight not visible: Confirm highlightConfig settings and theme; ensure rowKey matches rendered rows.
- Column resize not working: Verify colResizable is enabled and columns are reactive; check minWidth constraints.
- Tree expansion conflicts: Review defaultExpandAll/defaultExpandLevel/defaultExpandKeys; ensure proper rowKey generation.

**Section sources**
- [StkTable.vue:28-38](file://src/StkTable/StkTable.vue#L28-L38)
- [useHighlight.ts:28-65](file://src/StkTable/useHighlight.ts#L28-L65)
- [useColResize.ts:51-56](file://src/StkTable/useColResize.ts#L51-L56)
- [useTree.ts:13-15](file://src/StkTable/useTree.ts#L13-L15)

## Conclusion
Stk Table Vue delivers a robust, high-performance solution for real-time, data-intensive applications. Its dual Vue 2.7/3.x compatibility, comprehensive virtualization, and advanced features like highlighting, resizable columns, tree tables, and merged cells make it a versatile choice for demanding UI needs. The project's active development and detailed documentation further support long-term maintainability and ease of adoption.

The recent package metadata enhancements, including standardized author identification, explicit MIT license clarification, improved repository configuration, and comprehensive keyword reorganization, strengthen the project's professional foundation and discoverability while maintaining its commitment to open-source collaboration and developer accessibility.

## Appendices

### Installation and Quick Start
- Install via npm and import the stylesheet and component as shown in the documentation.
- Vue 2.7 usage is supported by importing the SFC source directly.

**Section sources**
- [start.md:7-28](file://docs-src/main/start/start.md#L7-L28)
- [vue2-usage.md:1-47](file://docs-src/main/start/vue2-usage.md#L1-L47)

### Basic Usage Example
- Configure columns, dataSource, and rowKey; apply height via inline styles.
- Explore the basic demo for a minimal setup.

**Section sources**
- [basic.md:8-39](file://docs-src/main/table/basic/basic.md#L8-L39)

### Supported Features Overview
- Virtual scrolling (vertical, horizontal, mixed)
- Highlighting (rows and cells) with animation/CSS modes
- Advanced column management (custom cells, sortable headers, fixed/resizable columns)
- Tree table and merged cells
- Custom scrollbar and scroll-row-by-row behavior

**Section sources**
- [StkTable.vue:28-476](file://src/StkTable/StkTable.vue#L28-L476)
- [types/index.ts:54-120](file://src/StkTable/types/index.ts#L54-L120)

### Maturity, Community, and Roadmap
- The project is actively maintained with regular releases and changelog updates.
- Community resources include online demos, StackBlitz playground, and official documentation.
- Roadmap directions include ongoing enhancements to virtualization, UX polish, and feature stability.

**Section sources**
- [CHANGELOG.md:1-200](file://CHANGELOG.md#L1-L200)
- [README.md:22-96](file://README.md#L22-L96)
- [index.md:1-46](file://docs-src/index.md#L1-L46)