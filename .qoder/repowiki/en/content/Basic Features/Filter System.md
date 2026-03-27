# Filter System

<cite>
**Referenced Files in This Document**
- [useFilter.ts](file://src/StkTable/components/Filter/useFilter.ts)
- [Filter.vue](file://src/StkTable/components/Filter/Filter.vue)
- [Dropdown/index.vue](file://src/StkTable/components/Filter/Dropdown/index.vue)
- [types.ts](file://src/StkTable/components/Filter/types.ts)
- [Filter.less](file://src/StkTable/components/Filter/Filter.less)
- [StkTable.vue](file://src/StkTable/StkTable.vue)
- [index.ts](file://src/StkTable/index.ts)
- [FilterDemo.vue](file://docs-demo/basic/filter/FilterDemo.vue)
</cite>

## Update Summary
**Changes Made**
- Enhanced dropdown positioning system with improved boundary detection and automatic positioning calculations
- Added safety padding constants for better viewport positioning
- Implemented document-relative coordinate handling for accurate positioning
- Improved viewport boundary detection with fallback positioning logic

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Enhanced Positioning System](#enhanced-positioning-system)
5. [Filter Implementation](#filter-implementation)
6. [Integration with StkTable](#integration-with-stktable)
7. [Usage Examples](#usage-examples)
8. [Styling and Theming](#styling-and-theming)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Conclusion](#conclusion)

## Introduction

The Filter System is a comprehensive filtering solution integrated into the StkTable component library. It provides users with the ability to apply multi-value filters to table columns through an intuitive dropdown interface. The system supports both local and remote filtering modes, allowing developers to customize how filtering is applied based on their specific requirements.

The filter system consists of several key components working together to provide a seamless filtering experience: a filter hook for managing filter state, a filter component for rendering filter controls in table headers, an enhanced dropdown component with improved positioning system for selecting filter options, and integration with the main StkTable component for applying filters to data sources.

## System Architecture

The filter system follows a modular architecture with clear separation of concerns:

```mermaid
graph TB
subgraph "Filter System Components"
useFilter[useFilter Hook]
FilterComp[Filter Component]
Dropdown[Enhanced Dropdown Component]
Types[Type Definitions]
Styles[Filter Styles]
end
subgraph "StkTable Integration"
StkTable[StkTable Main Component]
FilterStatus[Filter Status Management]
DataSource[Data Source Filtering]
end
subgraph "External Dependencies"
Vue[Vue 3 Core]
Less[Less Styling]
end
useFilter --> FilterComp
FilterComp --> Dropdown
FilterComp --> Types
FilterComp --> Styles
useFilter --> StkTable
StkTable --> FilterStatus
FilterStatus --> DataSource
StkTable --> Vue
Styles --> Less
```

**Diagram sources**
- [useFilter.ts:1-91](file://src/StkTable/components/Filter/useFilter.ts#L1-L91)
- [Filter.vue:1-55](file://src/StkTable/components/Filter/Filter.vue#L1-L55)
- [Dropdown/index.vue:1-186](file://src/StkTable/components/Filter/Dropdown/index.vue#L1-L186)
- [StkTable.vue:1022-1046](file://src/StkTable/StkTable.vue#L1022-L1046)

The architecture demonstrates a clean separation where the useFilter hook manages filter state and creates filter components, while the StkTable component handles the actual data filtering logic. The enhanced dropdown component provides the user interface for selecting filter options with improved positioning capabilities.

**Section sources**
- [useFilter.ts:1-91](file://src/StkTable/components/Filter/useFilter.ts#L1-L91)
- [StkTable.vue:1022-1046](file://src/StkTable/StkTable.vue#L1022-L1046)

## Core Components

### Filter Hook (useFilter)

The `useFilter` hook serves as the primary interface for implementing filtering functionality in StkTable. It manages filter state and creates filter components for table headers.

```mermaid
classDiagram
class UseFilter {
+filterStatus : Ref~Record~
+Filter(config, component) : Component
-findStkTableInstance(instance) : ComponentInstance
-handleChange(values) : void
}
class FilterStatus {
+value : any[]
}
class FilterOption {
+label : string
+value : any
+selected? : boolean
}
class UseFilterOptions {
+filterRemote : boolean
}
UseFilter --> FilterStatus : manages
UseFilter --> FilterOption : uses
UseFilter --> UseFilterOptions : configured by
```

**Diagram sources**
- [useFilter.ts:33-91](file://src/StkTable/components/Filter/useFilter.ts#L33-L91)
- [types.ts:10-18](file://src/StkTable/components/Filter/types.ts#L10-L18)

The hook maintains a reactive filter status object that tracks the current filter selections for each column. It provides a factory function for creating filter components that can be injected into table column headers.

**Section sources**
- [useFilter.ts:28-91](file://src/StkTable/components/Filter/useFilter.ts#L28-L91)
- [types.ts:10-18](file://src/StkTable/components/Filter/types.ts#L10-L18)

### Filter Component

The Filter component renders the filter control in table headers and handles user interactions for opening the filter dropdown.

```mermaid
classDiagram
class FilterComponent {
+props : CustomHeaderCellProps
+theme : 'light' | 'dark'
+active : boolean
+options : FilterOption[]
+handleIconClick(event) : void
+handleConfirm(values) : void
}
class CustomHeaderCellProps {
+col : StkTableColumn
+colIndex : number
+rowIndex : number
}
FilterComponent --> CustomHeaderCellProps : extends
FilterComponent --> FilterOption : displays
```

**Diagram sources**
- [Filter.vue:7-39](file://src/StkTable/components/Filter/Filter.vue#L7-L39)

The component inherits from the standard header cell props and adds filter-specific functionality including theme support and option display.

**Section sources**
- [Filter.vue:1-55](file://src/StkTable/components/Filter/Filter.vue#L1-L55)

### Enhanced Dropdown Component

The dropdown component provides the interactive interface for selecting filter options with an enhanced positioning system.

```mermaid
classDiagram
class EnhancedDropdownComponent {
+theme : Ref~'light' | 'dark'~
+visible : Ref~boolean~
+position : Ref~Position~
+options : Ref~FilterOption[]~
+checkedTempValueSet : Set~any~
+DROPDOWN_DEFAULT_WIDTH : number
+DROPDOWN_DEFAULT_HEIGHT : number
+PADDING : number
+show(position, options, callback) : void
+hide() : void
+confirm() : void
+calculatePosition(docPos) : Position
+handleRowClick(event, row) : void
+setTheme(theme) : void
}
class Position {
+x : number
+y : number
}
EnhancedDropdownComponent --> Position : calculates
EnhancedDropdownComponent --> FilterOption : manages
```

**Diagram sources**
- [Dropdown/index.vue:42-94](file://src/StkTable/components/Filter/Dropdown/index.vue#L42-L94)

The enhanced dropdown includes safety padding constants, automatic positioning calculations, and improved boundary detection for optimal viewport positioning.

**Section sources**
- [Dropdown/index.vue:1-186](file://src/StkTable/components/Filter/Dropdown/index.vue#L1-L186)

## Enhanced Positioning System

### Automatic Position Calculation

The enhanced dropdown positioning system automatically calculates the best placement for the filter dropdown based on viewport boundaries and available space.

```mermaid
flowchart TD
Start([Show Dropdown]) --> GetDocPos["Get Document Coordinates"]
GetDocPos --> CalcViewport["Calculate Viewport Dimensions"]
CalcViewport --> CheckRightBound{"Right Boundary Exceeded?"}
CheckRightBound --> |Yes| AdjustRight["Adjust X Position"]
CheckRightBound --> |No| CheckBottomBound{"Bottom Boundary Exceeded?"}
AdjustRight --> CheckBottomBound
CheckBottomBound --> |Yes| CheckTopSpace{"Top Space Available?"}
CheckBottomBound --> |No| EnsureBounds["Ensure Minimum Bounds"]
CheckTopSpace --> |Yes| ShowAbove["Show Above Trigger"]
CheckTopSpace --> |No| UseMaxSpace["Use Maximum Available Space"]
ShowAbove --> EnsureBounds
UseMaxSpace --> EnsureBounds
EnsureBounds --> FinalPos["Final Position"]
```

**Diagram sources**
- [Dropdown/index.vue:56-95](file://src/StkTable/components/Filter/Dropdown/index.vue#L56-L95)

The positioning system considers document-relative coordinates, viewport boundaries, and safety padding to ensure the dropdown is always fully visible.

### Safety Padding Constants

The system implements safety padding constants to prevent dropdown overlap with viewport edges:

| Constant | Value | Purpose |
|----------|-------|---------|
| `DROPDOWN_DEFAULT_WIDTH` | 300px | Default width for initial size calculation |
| `DROPDOWN_DEFAULT_HEIGHT` | 400px | Default height for initial size calculation |
| `PADDING` | 8px | Safety distance from viewport edges |

### Document-Relative Coordinate Handling

The positioning system converts element coordinates to document-relative positions, accounting for scroll offsets:

```mermaid
sequenceDiagram
participant User as User
participant Filter as Filter Component
participant Dropdown as Enhanced Dropdown
participant Window as Browser Window
User->>Filter : Click Filter Icon
Filter->>Filter : Calculate Element Rect
Filter->>Window : Get Scroll Offsets
Filter->>Dropdown : Pass Document Coordinates
Dropdown->>Dropdown : Convert to Viewport Coordinates
Dropdown->>Dropdown : Check Boundary Conditions
Dropdown->>Dropdown : Calculate Optimal Position
Dropdown->>User : Display Positioned Dropdown
```

**Diagram sources**
- [Filter.vue:22-40](file://src/StkTable/components/Filter/Filter.vue#L22-L40)
- [Dropdown/index.vue:56-95](file://src/StkTable/components/Filter/Dropdown/index.vue#L56-L95)

**Section sources**
- [Dropdown/index.vue:31-95](file://src/StkTable/components/Filter/Dropdown/index.vue#L31-L95)
- [Filter.vue:22-40](file://src/StkTable/components/Filter/Filter.vue#L22-L40)

## Filter Implementation

### Data Filtering Logic

The filtering system applies filters to data sources using a multi-criteria approach where each column's filter conditions are combined with logical AND operations.

```mermaid
flowchart TD
Start([Filter Application]) --> CheckFilters{"Any Filters Active?"}
CheckFilters --> |No| ReturnOriginal["Return Original Data"]
CheckFilters --> |Yes| IterateRows["Iterate Through Each Row"]
IterateRows --> CheckCriteria["Check Each Filter Criterion"]
CheckCriteria --> HasValue{"Has Filter Value?"}
HasValue --> |No| PassRow["Row Passes (No Filter)"]
HasValue --> |Yes| CheckMatch["Check Value Match"]
CheckMatch --> AnyMatch{"Any Value Matches?"}
AnyMatch --> |Yes| KeepRow["Keep Row"]
AnyMatch --> |No| RemoveRow["Remove Row"]
KeepRow --> NextRow["Next Row"]
RemoveRow --> NextRow
NextRow --> MoreRows{"More Rows?"}
MoreRows --> |Yes| CheckCriteria
MoreRows --> |No| ReturnFiltered["Return Filtered Data"]
ReturnOriginal --> End([Complete])
ReturnFiltered --> End
```

**Diagram sources**
- [StkTable.vue:1036-1046](file://src/StkTable/StkTable.vue#L1036-L1046)

The filtering algorithm evaluates each row against all active filter criteria, ensuring that only rows meeting all filter conditions are included in the final dataset.

**Section sources**
- [StkTable.vue:1036-1046](file://src/StkTable/StkTable.vue#L1036-L1046)

### Filter State Management

The system maintains filter state through a reactive object structure that maps column keys to their respective filter values.

```mermaid
sequenceDiagram
participant User as User
participant FilterUI as Filter Component
participant Dropdown as Enhanced Dropdown
participant Hook as useFilter Hook
participant StkTable as StkTable Instance
User->>FilterUI : Click Filter Icon
FilterUI->>Dropdown : show(position, options, callback)
Dropdown->>User : Display Filter Options
User->>Dropdown : Select/Deselect Options
User->>Dropdown : Click Confirm
Dropdown->>FilterUI : handleConfirm(selectedValues)
FilterUI->>Hook : handleChange(selectedValues)
Hook->>StkTable : setFilter(filterStatus, options)
StkTable->>StkTable : filterDataSource(data)
StkTable->>User : Updated Filtered Data
```

**Diagram sources**
- [useFilter.ts:65-68](file://src/StkTable/components/Filter/useFilter.ts#L65-L68)
- [StkTable.vue:1022-1034](file://src/StkTable/StkTable.vue#L1022-L1034)

**Section sources**
- [useFilter.ts:33-91](file://src/StkTable/components/Filter/useFilter.ts#L33-L91)
- [StkTable.vue:1022-1034](file://src/StkTable/StkTable.vue#L1022-L1034)

## Integration with StkTable

### Exposed Methods

The StkTable component exposes a `setFilter` method that allows external components to programmatically control filtering state.

| Method | Parameters | Description |
|--------|------------|-------------|
| `setFilter` | `status: Record<UniqKey, FilterStatus> \| null`<br/>`option?: { remote?: boolean }` | Sets the filter status and optionally triggers remote filtering |

### Event Emission

The filter system emits a `filter-change` event whenever filter state changes occur, providing real-time feedback to applications.

```mermaid
stateDiagram-v2
[*] --> Idle
Idle --> FilterActive : User Applies Filter
FilterActive --> Processing : setFilter Called
Processing --> DataFiltered : filterDataSource Applied
DataFiltered --> EventEmitted : filter-change Event
EventEmitted --> Idle : Filter Complete
note right of FilterActive
Filter options selected
in enhanced dropdown interface
end note
note right of Processing
Filter status updated
Data source filtered
end note
note right of DataFiltered
New filtered dataset
Ready for display
end note
```

**Diagram sources**
- [StkTable.vue:1022-1034](file://src/StkTable/StkTable.vue#L1022-L1034)
- [StkTable.vue:681-685](file://src/StkTable/StkTable.vue#L681-L685)

**Section sources**
- [StkTable.vue:1022-1034](file://src/StkTable/StkTable.vue#L1022-L1034)
- [StkTable.vue:681-685](file://src/StkTable/StkTable.vue#L681-L685)

## Usage Examples

### Basic Filter Setup

The most common usage pattern involves importing the filter hook and applying it to table columns.

**Section sources**
- [FilterDemo.vue:21-28](file://docs-demo/basic/filter/FilterDemo.vue#L21-L28)

### Advanced Configuration

For more complex scenarios, developers can configure filter options including remote filtering capabilities and custom filter handlers.

**Section sources**
- [useFilter.ts:33-34](file://src/StkTable/components/Filter/useFilter.ts#L33-L34)

## Styling and Theming

### Theme Support

The filter system supports both light and dark themes, with automatic theme detection from the parent StkTable component.

| Theme Variant | Color Variables | Visual Effects |
|---------------|----------------|----------------|
| Light Theme | `--text-color: rgba(0, 0, 0, 0.85)`<br/>`--bg-color: #ffffff`<br/>`--border-color: #e8e8e8` | Light background with subtle borders |
| Dark Theme | `--text-color: rgba(255, 255, 255, 0.85)`<br/>`--bg-color: #181c21`<br/>`--border-color: #303439` | Dark background with contrasting borders |

### Responsive Design

The enhanced filter dropdown adapts to different screen sizes and positions itself relative to the filter icon for optimal user experience, with improved boundary detection and automatic positioning calculations.

**Section sources**
- [Filter.less:27-58](file://src/StkTable/components/Filter/Filter.less#L27-L58)
- [Dropdown/index.vue:78-88](file://src/StkTable/components/Filter/Dropdown/index.vue#L78-L88)

## Performance Considerations

### Virtual Scrolling Compatibility

The filter system is fully compatible with StkTable's virtual scrolling features, ensuring smooth performance even with large datasets.

### Memory Management

The enhanced dropdown component properly cleans up event listeners and temporary state when hidden, preventing memory leaks in long-running applications.

### Optimization Strategies

- **Debounced Updates**: Filter changes are processed efficiently to avoid excessive re-renders
- **Selective Rendering**: Only affected components are re-rendered when filter state changes
- **Efficient Data Structures**: Uses Set objects for O(1) lookup performance in filter operations
- **Boundary Detection**: Optimized viewport boundary calculations reduce layout thrashing

## Troubleshooting Guide

### Common Issues

**Issue**: Filter dropdown not appearing
- **Solution**: Ensure the filter component is properly mounted within a StkTable instance
- **Check**: Verify that `customHeaderCell` prop is correctly configured on table columns

**Issue**: Filters not applying to data
- **Solution**: Confirm that `setFilter` method is being called with proper filter status
- **Check**: Verify that `filterRemote` option is correctly configured for remote filtering scenarios

**Issue**: Theme inconsistencies
- **Solution**: Ensure parent StkTable component has proper theme configuration
- **Check**: Verify CSS variables are properly defined in the component styles

**Issue**: Dropdown positioned incorrectly
- **Solution**: Verify that the page has proper scroll offsets and viewport dimensions
- **Check**: Ensure the filter icon element has proper bounding rectangle calculations

### Debugging Tips

1. **Console Logging**: Monitor `filter-change` events to track filter state changes
2. **State Inspection**: Use Vue DevTools to inspect the reactive filter status object
3. **Network Monitoring**: For remote filtering, monitor network requests to ensure proper API calls
4. **Position Debugging**: Check calculated positions in the browser console for positioning issues

**Section sources**
- [StkTable.vue:681-685](file://src/StkTable/StkTable.vue#L681-L685)
- [useFilter.ts:65-68](file://src/StkTable/components/Filter/useFilter.ts#L65-L68)

## Conclusion

The Filter System provides a robust, flexible solution for implementing filtering functionality in StkTable components. Its modular architecture allows for easy integration while maintaining excellent performance characteristics. The system supports both simple and complex filtering scenarios through its comprehensive API and configuration options.

**Key Enhancements**:
- **Enhanced Positioning System**: Improved boundary detection with automatic positioning calculations
- **Safety Padding Constants**: Prevents dropdown overlap with viewport edges
- **Document-Relative Coordinates**: Accurate positioning accounting for scroll offsets
- **Fallback Positioning**: Intelligent positioning logic for edge cases

Key benefits include:
- **Intuitive User Interface**: Clean dropdown interface with checkbox selection and improved positioning
- **Flexible Configuration**: Support for both local and remote filtering modes
- **Performance Optimized**: Efficient filtering algorithms with virtual scrolling compatibility
- **Theme Support**: Consistent theming across light and dark modes
- **Developer Friendly**: Simple API with comprehensive type definitions
- **Responsive Design**: Adaptive positioning system for various viewport sizes

The system is designed to scale from basic filtering needs to complex enterprise applications requiring sophisticated data manipulation capabilities.