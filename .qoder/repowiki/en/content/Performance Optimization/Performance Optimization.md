# Performance Optimization

<cite>
**Referenced Files in This Document**
- [StkTable.vue](file://src/StkTable/StkTable.vue)
- [useVirtualScroll.ts](file://src/StkTable/useVirtualScroll.ts)
- [useAutoResize.ts](file://src/StkTable/useAutoResize.ts)
- [useScrollbar.ts](file://src/StkTable/useScrollbar.ts)
- [utils/index.ts](file://src/StkTable/utils/index.ts)
- [const.ts](file://src/StkTable/const.ts)
- [types/index.ts](file://src/StkTable/types/index.ts)
- [VirtualY.vue](file://docs-demo/advanced/virtual/VirtualY.vue)
- [HugeData/index.vue](file://docs-demo/demos/HugeData/index.vue)
- [VirtualTree.vue](file://src/VirtualTree.vue)
- [vue2-scroll-optimize.md](file://docs-src/en/main/table/advanced/vue2-scroll-optimize.md)
</cite>

## Update Summary
**Changes Made**
- Enhanced virtual scrolling performance section with improved pre-judgment logic
- Added detailed explanation of redundant processing prevention during rapid scrolling
- Updated optimization strategy documentation for Vue 2 scroll optimization
- Expanded troubleshooting guide with specific pre-judgment logic examples

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
This document focuses on performance optimization strategies for Stk Table Vue, with emphasis on virtual scrolling, memory management, rendering optimization, and handling large datasets. It consolidates best practices, component lifecycle optimization, reactive data management, DOM manipulation minimization, benchmarking, monitoring, profiling, and common pitfalls with concrete references to the codebase.

**Updated** Enhanced virtual scrolling performance through targeted optimization of the `updateVirtualScrollY` function, featuring improved pre-judgment logic that prevents redundant processing cycles during rapid scrolling operations.

## Project Structure
Stk Table Vue organizes performance-critical logic into modular composable hooks and a central table component:
- Central component: renders the table, orchestrates virtual scrolling, merges cells, highlights, and integrates optional features (tree, drag selection, custom scrollbar).
- Hooks:
  - Virtual scrolling: computes visible windows, offsets, and manages row/column visibility with enhanced pre-judgment optimization.
  - Auto resize: observes container size changes and recalibrates virtual scrolling.
  - Custom scrollbar: optional native-like scrollbar with drag support.
  - Utilities: sorting helpers, throttling, and browser compatibility constants.
- Demo pages illustrate large dataset scenarios and virtual scrolling usage.

```mermaid
graph TB
STK["StkTable.vue"]
VS["useVirtualScroll.ts"]
AR["useAutoResize.ts"]
SB["useScrollbar.ts"]
UT["utils/index.ts"]
CT["const.ts"]
TY["types/index.ts"]
STK --> VS
STK --> AR
STK --> SB
STK --> UT
STK --> CT
STK --> TY
```

**Diagram sources**
- [StkTable.vue:209-800](file://src/StkTable/StkTable.vue#L209-L800)
- [useVirtualScroll.ts:60-495](file://src/StkTable/useVirtualScroll.ts#L60-L495)
- [useAutoResize.ts:14-92](file://src/StkTable/useAutoResize.ts#L14-L92)
- [useScrollbar.ts:29-190](file://src/StkTable/useScrollbar.ts#L29-L190)
- [utils/index.ts:1-288](file://src/StkTable/utils/index.ts#L1-L288)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [types/index.ts:1-318](file://src/StkTable/types/index.ts#L1-L318)

**Section sources**
- [StkTable.vue:209-800](file://src/StkTable/StkTable.vue#L209-L800)
- [useVirtualScroll.ts:60-495](file://src/StkTable/useVirtualScroll.ts#L60-L495)
- [useAutoResize.ts:14-92](file://src/StkTable/useAutoResize.ts#L14-L92)
- [useScrollbar.ts:29-190](file://src/StkTable/useScrollbar.ts#L29-L190)
- [utils/index.ts:1-288](file://src/StkTable/utils/index.ts#L1-L288)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [types/index.ts:1-318](file://src/StkTable/types/index.ts#L1-L318)

## Core Components
- Virtual Scrolling Engine: Computes visible rows/columns, offsets, and handles auto row height and expanded row heights with enhanced pre-judgment optimization.
- Auto Resize Hook: Observes container resize via ResizeObserver or window resize and recalibrates virtual scrolling with debouncing.
- Custom Scrollbar: Optional native-like scrollbar with throttled updates and drag interactions.
- Sorting Utilities: Efficient helpers for ordered insertion and locale-aware comparisons.
- Constants and Types: Provide defaults, compatibility flags, and type-safe configurations.

**Section sources**
- [useVirtualScroll.ts:60-495](file://src/StkTable/useVirtualScroll.ts#L60-L495)
- [useAutoResize.ts:14-92](file://src/StkTable/useAutoResize.ts#L14-L92)
- [useScrollbar.ts:29-190](file://src/StkTable/useScrollbar.ts#L29-L190)
- [utils/index.ts:153-207](file://src/StkTable/utils/index.ts#L153-L207)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [types/index.ts:54-120](file://src/StkTable/types/index.ts#L54-L120)

## Architecture Overview
The table component composes multiple hooks to manage performance-sensitive operations. Virtual scrolling is the core mechanism to render only visible items, while auto resize and custom scrollbar keep the viewport consistent under dynamic conditions.

```mermaid
sequenceDiagram
participant C as "Container"
participant S as "StkTable.vue"
participant VS as "useVirtualScroll.ts"
participant AR as "useAutoResize.ts"
participant SB as "useScrollbar.ts"
C->>S : Mount table with virtual props
S->>VS : initVirtualScroll()
VS-->>S : virtualScroll, virtual_dataSourcePart
S->>AR : observe container size
AR-->>S : after debounce, re-init virtual scroll
S->>SB : updateCustomScrollbar()
SB-->>S : scrollbar metrics
S-->>C : Render visible rows/columns
```

**Diagram sources**
- [StkTable.vue:763-791](file://src/StkTable/StkTable.vue#L763-L791)
- [useVirtualScroll.ts:196-236](file://src/StkTable/useVirtualScroll.ts#L196-L236)
- [useAutoResize.ts:76-90](file://src/StkTable/useAutoResize.ts#L76-L90)
- [useScrollbar.ts:78-99](file://src/StkTable/useScrollbar.ts#L78-L99)

## Detailed Component Analysis

### Virtual Scrolling Engine
The engine computes:
- Visible row range and offsets for vertical virtualization.
- Visible column range and offsets for horizontal virtualization.
- Dynamic row heights including auto height and expanded rows.
- Corrections for merged rows to avoid partial spans.
- Enhanced pre-judgment logic to prevent redundant processing during rapid scrolling.

**Updated** Enhanced pre-judgment logic in `updateVirtualScrollY` prevents redundant processing cycles by checking if the calculated window has changed before triggering updates, significantly improving performance during rapid scrolling operations.

```mermaid
flowchart TD
Start(["Scroll Event"]) --> CalcY["Compute Y Window<br/>updateVirtualScrollY()"]
CalcY --> PreJudge["Pre-judgment Logic<br/>Check for Redundant Processing"]
PreJudge --> FastScroll{"Fast Rapid Scroll?"}
FastScroll --> |Yes| PageCheck["Math.abs(oldStartIndex - startIndex) >= pageSize"]
FastScroll --> |No| Normal["Normal Scroll Path"]
PageCheck --> |True| ForceUpdate["Force Update<br/>Direct State Assignment"]
PageCheck --> |False| OptimizeCheck["optimizeVue2Scroll Check"]
OptimizeCheck --> |Enabled| Vue2Opt["Vue2 Scroll Down Optimization"]
OptimizeCheck --> |Disabled| DirectUpdate["Direct State Assignment"]
FastScroll --> |No| Normal
Normal --> AutoH{"Auto Row Height?"}
AutoH --> |Yes| Measure["Measure DOM heights (trRef)"]
AutoH --> |No| Exact["Exact row count by height"]
Measure --> FixMerged["Fix merged spans crossing window"]
Exact --> FixMerged
FixMerged --> StripeAdj{"Stripe adjustment?"}
StripeAdj --> |Yes| EvenStart["Round startIndex to even"]
StripeAdj --> |No| SkipEven["Skip"]
EvenStart --> SetState["Set startIndex/endIndex/offsetTop"]
SkipEven --> SetState
ForceUpdate --> SetState
Vue2Opt --> SetState
DirectUpdate --> SetState
SetState --> End(["Render Visible Rows"])
```

**Diagram sources**
- [useVirtualScroll.ts:310-460](file://src/StkTable/useVirtualScroll.ts#L310-L460)

Best practices derived from the implementation:
- Prefer exact row counting when auto row height is not used to minimize DOM measurements.
- Use trRef measurement only when auto height is enabled to cache per-row heights.
- Apply enhanced pre-judgment logic to detect and prevent redundant processing during rapid scrolling.
- Correct merged spans to prevent partial row rendering.
- Apply stripe alignment adjustments to avoid visual artifacts during fast scrolls.
- Leverage Vue 2 scroll optimization for smoother downward scrolling experiences.

**Section sources**
- [useVirtualScroll.ts:310-460](file://src/StkTable/useVirtualScroll.ts#L310-L460)

### Auto Resize and Debounced Recalculation
- Watches virtual and virtualX flags to attach observers.
- Uses ResizeObserver when available; falls back to window resize.
- Debounces recalculations to avoid layout thrashing.

```mermaid
sequenceDiagram
participant W as "Window/Observer"
participant AR as "useAutoResize.ts"
participant VS as "useVirtualScroll.ts"
W->>AR : resize event
AR->>AR : debounce timer
AR->>VS : initVirtualScroll()
VS-->>AR : updated pageSize/startIndex/endIndex
```

**Diagram sources**
- [useAutoResize.ts:76-90](file://src/StkTable/useAutoResize.ts#L76-L90)
- [useVirtualScroll.ts:196-229](file://src/StkTable/useVirtualScroll.ts#L196-L229)

**Section sources**
- [useAutoResize.ts:14-92](file://src/StkTable/useAutoResize.ts#L14-L92)
- [useVirtualScroll.ts:196-229](file://src/StkTable/useVirtualScroll.ts#L196-L229)

### Custom Scrollbar
- Throttles updates to reduce layout work.
- Computes thumb sizes and positions based on scroll ratios.
- Supports drag interactions for both axes.

```mermaid
flowchart TD
Init(["Init Scrollbar"]) --> Observe["Observe container"]
Observe --> Update["updateCustomScrollbar()"]
Update --> NeedV{"Need Vertical?"}
NeedV --> |Yes| VThumb["Compute v-thumb h/left/top"]
NeedV --> |No| SkipV["Skip"]
Update --> NeedH{"Need Horizontal?"}
NeedH --> |Yes| HThumb["Compute h-thumb w/left"]
NeedH --> |No| SkipH["Skip"]
VThumb --> End(["Render Scrollbar"])
HThumb --> End
SkipV --> End
SkipH --> End
```

**Diagram sources**
- [useScrollbar.ts:78-99](file://src/StkTable/useScrollbar.ts#L78-L99)

**Section sources**
- [useScrollbar.ts:29-190](file://src/StkTable/useScrollbar.ts#L29-L190)

### Sorting Utilities and Ordered Insertion
- Binary search insertion maintains sorted arrays without full re-sort.
- Locale-aware string comparison and configurable empty-to-bottom behavior.

```mermaid
flowchart TD
Start(["New Item"]) --> EmptyCheck{"Empty Value?"}
EmptyCheck --> |Yes| AppendEnd["Append to end (emptyToBottom)"]
EmptyCheck --> |No| Compare["Custom compare or localeCompare"]
Compare --> BinSearch["Binary Search Insert Position"]
BinSearch --> Splice["splice into array"]
AppendEnd --> End(["Sorted Array"])
Splice --> End
```

**Diagram sources**
- [utils/index.ts:25-66](file://src/StkTable/utils/index.ts#L25-L66)
- [utils/index.ts:73-92](file://src/StkTable/utils/index.ts#L73-L92)
- [utils/index.ts:102-116](file://src/StkTable/utils/index.ts#L102-L116)

**Section sources**
- [utils/index.ts:153-207](file://src/StkTable/utils/index.ts#L153-L207)

### Large Dataset Demo Patterns
- Demonstrates virtual and virtualX enabled with a large data source.
- Highlights efficient rendering of tens of thousands of rows.

**Section sources**
- [VirtualY.vue:1-34](file://docs-demo/advanced/virtual/VirtualY.vue#L1-L34)
- [HugeData/index.vue:1-373](file://docs-demo/demos/HugeData/index.vue#L1-L373)

### Additional Virtual List Example
- A dedicated virtual tree/list component illustrates similar virtualization patterns for hierarchical data.

**Section sources**
- [VirtualTree.vue:1-623](file://src/VirtualTree.vue#L1-L623)

## Dependency Analysis
The table component depends on several focused hooks. Coupling is low due to composables; cohesion is high within each hook's responsibility.

```mermaid
graph LR
STK["StkTable.vue"] --> VS["useVirtualScroll.ts"]
STK --> AR["useAutoResize.ts"]
STK --> SB["useScrollbar.ts"]
STK --> UT["utils/index.ts"]
STK --> CT["const.ts"]
STK --> TY["types/index.ts"]
```

**Diagram sources**
- [StkTable.vue:209-800](file://src/StkTable/StkTable.vue#L209-L800)
- [useVirtualScroll.ts:60-495](file://src/StkTable/useVirtualScroll.ts#L60-L495)
- [useAutoResize.ts:14-92](file://src/StkTable/useAutoResize.ts#L14-L92)
- [useScrollbar.ts:29-190](file://src/StkTable/useScrollbar.ts#L29-L190)
- [utils/index.ts:1-288](file://src/StkTable/utils/index.ts#L1-L288)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [types/index.ts:1-318](file://src/StkTable/types/index.ts#L1-L318)

**Section sources**
- [StkTable.vue:209-800](file://src/StkTable/StkTable.vue#L209-L800)
- [useVirtualScroll.ts:60-495](file://src/StkTable/useVirtualScroll.ts#L60-L495)
- [useAutoResize.ts:14-92](file://src/StkTable/useAutoResize.ts#L14-L92)
- [useScrollbar.ts:29-190](file://src/StkTable/useScrollbar.ts#L29-L190)
- [utils/index.ts:1-288](file://src/StkTable/utils/index.ts#L1-L288)
- [const.ts:1-51](file://src/StkTable/const.ts#L1-L51)
- [types/index.ts:1-318](file://src/StkTable/types/index.ts#L1-L318)

## Performance Considerations

### Virtual Scrolling Best Practices
- Enable virtual for large datasets and virtualX when total column width exceeds container width.
- Set explicit widths for columns to enable horizontal virtualization.
- Prefer exact row heights when possible; use auto row height only when content varies significantly.
- Avoid frequent reflows by minimizing DOM measurements inside the scroll loop.
- **Enhanced** Utilize the improved pre-judgment logic to prevent redundant processing during rapid scrolling operations.

**Section sources**
- [useVirtualScroll.ts:127-132](file://src/StkTable/useVirtualScroll.ts#L127-L132)
- [useVirtualScroll.ts:178-190](file://src/StkTable/useVirtualScroll.ts#L178-L190)

### Memory Management Techniques
- Cache row heights in a Map keyed by row key to avoid repeated measurements.
- Clear cached heights when data changes to prevent stale measurements.
- Use shallow refs for data sources to reduce deep reactivity overhead.

**Section sources**
- [useVirtualScroll.ts:241-253](file://src/StkTable/useVirtualScroll.ts#L241-L253)
- [StkTable.vue:717-718](file://src/StkTable/StkTable.vue#L717-L718)

### Rendering Optimization
- Render only visible rows/columns; keep template logic minimal inside loops.
- Use computed properties for derived values (e.g., virtual data parts, offsets).
- Avoid unnecessary watchers and reactive churn by batching updates.

**Section sources**
- [useVirtualScroll.ts:104-108](file://src/StkTable/useVirtualScroll.ts#L104-L108)
- [useVirtualScroll.ts:110-125](file://src/StkTable/useVirtualScroll.ts#L110-L125)

### Handling Large Datasets Efficiently
- Use server-side sorting and pagination for extremely large datasets.
- For client-side virtualization, prefer binary insertion for live-updated streams.
- Keep column widths static to stabilize horizontal virtualization.

**Section sources**
- [utils/index.ts:25-66](file://src/StkTable/utils/index.ts#L25-L66)
- [HugeData/index.vue:121-148](file://docs-demo/demos/HugeData/index.vue#L121-L148)

### Component Lifecycle Optimization
- Initialize virtual scrolling after mount and after container size is known.
- Attach observers conditionally based on props to avoid unnecessary listeners.
- Clean up observers on unmount to prevent memory leaks.

**Section sources**
- [useAutoResize.ts:32-40](file://src/StkTable/useAutoResize.ts#L32-L40)
- [useAutoResize.ts:65-74](file://src/StkTable/useAutoResize.ts#L65-L74)

### Reactive Data Management
- Use shallow refs for large arrays to avoid deep reactivity.
- Minimize reactive property churn; batch updates when modifying large lists.
- Leverage computed getters for derived state to reduce recomputation.

**Section sources**
- [StkTable.vue:717-718](file://src/StkTable/StkTable.vue#L717-L718)

### DOM Manipulation Minimization
- Prefer CSS transforms and offsets over moving DOM nodes.
- Use virtualized offsets for top/bottom padding to avoid shifting DOM.
- Limit custom scrollbar updates to throttled intervals.

**Section sources**
- [useVirtualScroll.ts:110-125](file://src/StkTable/useVirtualScroll.ts#L110-L125)
- [useScrollbar.ts:56-58](file://src/StkTable/useScrollbar.ts#L56-L58)

### Enhanced Pre-Judgment Logic for Virtual Scrolling
**New** The `updateVirtualScrollY` function now includes sophisticated pre-judgment logic to prevent redundant processing during rapid scrolling operations:

- **Page Size Threshold Check**: `Math.abs(oldStartIndex - startIndex) >= pageSize` prevents updates when scrolling faster than one page
- **Directional Optimization**: `sTop <= scrollTop` optimizes upward scrolling to prevent unnecessary DOM updates
- **Vue 2 Scroll Optimization**: When `optimizeVue2Scroll` is enabled, downward scrolling is split into two phases to improve Vue 2's diff mechanism performance

```mermaid
flowchart TD
Start(["updateVirtualScrollY Entry"]) --> CheckVirtual{"virtual_on.value"}
CheckVirtual --> |False| QuickReturn["Quick Return<br/>Set startIndex:0,endIndex:0"]
CheckVirtual --> |True| GetProps["Get Props<br/>autoRowHeight, stripe, optimizeVue2Scroll"]
GetProps --> CalcWindows["Calculate Window<br/>startIndex, endIndex"]
CalcWindows --> PreJudgment["Pre-judgment Logic"]
PreJudgment --> FastScroll{"Fast Scroll?<br/>Math.abs(...) >= pageSize"}
PreJudgment --> Upward{"Upward Scroll?<br/>sTop <= scrollTop"}
PreJudgment --> Vue2Opt{"optimizeVue2Scroll Enabled?"}
FastScroll --> |True| ForceUpdate["Force Update<br/>Direct State Assignment"]
Upward --> |True| ForceUpdate
Vue2Opt --> |True| Vue2Optimize["Vue2 Optimization<br/>Split Update Process"]
Vue2Opt --> |False| DirectUpdate["Direct Update"]
ForceUpdate --> End(["Update Complete"])
Vue2Optimize --> End
DirectUpdate --> End
```

**Diagram sources**
- [useVirtualScroll.ts:450-459](file://src/StkTable/useVirtualScroll.ts#L450-L459)

**Section sources**
- [useVirtualScroll.ts:450-459](file://src/StkTable/useVirtualScroll.ts#L450-L459)

### Benchmarking, Monitoring, and Profiling
- Use browser devtools performance panel to record scroll interactions and measure frame times.
- Monitor scroll events and log startIndex/endIndex to validate virtual windows.
- Profile long-running operations like sorting and binary insertion to ensure they remain below 1–2 ms per operation.

**Section sources**
- [HugeData/index.vue:192-194](file://docs-demo/demos/HugeData/index.vue#L192-L194)

## Troubleshooting Guide

Common pitfalls and solutions:
- White screen during fast vertical scroll: Enable optimizeVue2Scroll to defer updates slightly.
  - Reference: [useVirtualScroll.ts:450-459](file://src/StkTable/useVirtualScroll.ts#L450-L459)
- Incorrect merged row rendering: Ensure merged spans are corrected around window boundaries.
  - Reference: [useVirtualScroll.ts:384-417](file://src/StkTable/useVirtualScroll.ts#L384-L417)
- Horizontal virtualization not activating: Ensure columns have explicit widths and total width exceeds container width.
  - Reference: [useVirtualScroll.ts:127-132](file://src/StkTable/useVirtualScroll.ts#L127-L132)
- Scrollbar flicker or incorrect sizing: Throttle updates and recalculate after layout.
  - Reference: [useScrollbar.ts:56-58](file://src/StkTable/useScrollbar.ts#L56-L58), [useScrollbar.ts:78-99](file://src/StkTable/useScrollbar.ts#L78-L99)
- Excessive layout thrashing on resize: Debounce auto resize recalculations.
  - Reference: [useAutoResize.ts:76-90](file://src/StkTable/useAutoResize.ts#L76-L90)
- **Enhanced** Virtual scrolling performance issues during rapid scrolling: Check pre-judgment logic thresholds and Vue 2 optimization settings.
  - Reference: [useVirtualScroll.ts:450-459](file://src/StkTable/useVirtualScroll.ts#L450-L459)

**Section sources**
- [useVirtualScroll.ts:450-459](file://src/StkTable/useVirtualScroll.ts#L450-L459)
- [useVirtualScroll.ts:384-417](file://src/StkTable/useVirtualScroll.ts#L384-L417)
- [useVirtualScroll.ts:127-132](file://src/StkTable/useVirtualScroll.ts#L127-L132)
- [useScrollbar.ts:56-58](file://src/StkTable/useScrollbar.ts#L56-L58)
- [useScrollbar.ts:78-99](file://src/StkTable/useScrollbar.ts#L78-L99)
- [useAutoResize.ts:76-90](file://src/StkTable/useAutoResize.ts#L76-L90)

## Conclusion
Stk Table Vue achieves high-performance rendering for large datasets through a modular, composable architecture centered on virtual scrolling, debounced auto resizing, and optional custom scrollbar. The recent enhancement to the `updateVirtualScrollY` function provides sophisticated pre-judgment logic that prevents redundant processing during rapid scrolling operations, significantly improving performance. By following the best practices outlined—prefer exact row heights, cache measured heights, minimize DOM measurements, throttle updates, leverage binary insertion, and utilize the enhanced pre-judgment logic—you can maintain smooth interactions even with hundreds of thousands of rows.

## Appendices

### Practical Checklists
- Virtual Scrolling
  - Enable virtual and virtualX for large datasets.
  - Set explicit column widths for X virtualization.
  - Use auto row height only when necessary; clear caches on data changes.
  - **Enhanced** Enable optimizeVue2Scroll for Vue 2 applications experiencing scroll performance issues.
- Rendering
  - Keep templates inside loops minimal.
  - Use computed for derived values; avoid reactive churn.
- Resize and Scrollbar
  - Debounce resize recalculations.
  - Throttle custom scrollbar updates.
- Data Operations
  - Use binary insertion for live-updated sorted lists.
  - Batch DOM updates when modifying large arrays.
- Performance Optimization
  - **New** Monitor pre-judgment thresholds for optimal rapid scrolling performance.
  - **New** Configure Vue 2 scroll optimization based on application requirements.

### Enhanced Pre-Judgment Logic Configuration
**New** The following configuration options are available for fine-tuning virtual scrolling performance:

- `optimizeVue2Scroll`: Enables Vue 2 scroll optimization for smoother downward scrolling
- Page size threshold: Automatically detects and optimizes rapid scrolling beyond one page
- Directional optimization: Prevents unnecessary updates during upward scrolling
- Timeout-based updates: Uses delayed updates for Vue 2's diff mechanism optimization

**Section sources**
- [vue2-scroll-optimize.md:1-26](file://docs-src/en/main/table/advanced/vue2-scroll-optimize.md#L1-L26)
- [useVirtualScroll.ts:450-459](file://src/StkTable/useVirtualScroll.ts#L450-L459)