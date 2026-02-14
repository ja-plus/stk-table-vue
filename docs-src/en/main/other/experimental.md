# Experimental Features

## experimental.scrollY

Transform-based vertical scrolling simulation reduces layout thrashing and can improve scrolling performance in certain scenarios.

### Usage

```vue
<template>
  <StkTable
    virtual
    scroll-row-by-row
    :experimental="{ scrollY: true }"
    :data-source="dataSource"
    :columns="columns"
  />
</template>
```

### Notes

- This is an experimental feature and may change in future versions
- When combined with `scrollRowByRow`, the transform offset is disabled to avoid conflicts
- The feature requires `props.virtual` to be enabled for optimal performance
