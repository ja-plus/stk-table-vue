# cell-highlight 规格（delta）

## Purpose

定义行/单元格高亮动画的行为契约：为实时数据更新场景提供 setHighlightDimRow / setHighlightDimCell 实例方法，支持 Animation API 与 CSS 两种渲染方式，并规定全局高亮配置与约束。

## ADDED Requirements

### Requirement: 高亮行与高亮单元格实例方法

组件 SHALL expose `setHighlightDimRow(rowKeyValues: UniqKey[], option?)` 与 `setHighlightDimCell(rowKeyValue, colKeyValue, option?)`，分别高亮一行（支持批量 key）与一个单元格；高亮生效 MUST 以配置 `props.rowKey` 为前提。

#### Scenario: 批量高亮多行

- **WHEN** 数据更新后调用 `setHighlightDimRow(['id1', 'id2'])`
- **THEN** 对应行播放高亮渐暗动画提醒用户数据变化

### Requirement: 支持 animation 与 css 两种高亮方式

`option.method` 为 `'animation'`（默认）时 SHALL 使用 Web Animations API（el.animate）渲染，可通过 `option.keyframe` 自定义关键帧；为 `'css'` 时 SHALL 为元素添加 `option.className` 并在 `option.duration` 后移除该 class，duration MUST 与 CSS 动画时长一致。

#### Scenario: css 方式自定义高亮

- **WHEN** 调用高亮方法传入 `{ method: 'css', className: 'my-hl', duration: 2000 }`
- **THEN** 元素添加 `my-hl` class 播放 CSS 动画，2 秒后 class 被移除

### Requirement: 全局高亮配置

`props.highlightConfig` SHALL 支持 `duration`（持续时间）与 `fps`（动画帧率，降低帧率有利于性能）；使用方自定义 keyframe 时 `fps` MUST 失效。高亮颜色 SHALL NOT 随主题实时变化。

#### Scenario: 自定义 keyframe 时帧率配置失效

- **WHEN** 配置 `highlightConfig.fps` 但调用高亮方法时传入自定义 keyframe
- **THEN** 动画按自定义 keyframe 播放，fps 配置不生效

### Requirement: 忽略不可见元素选项

`option.ignoreInvisible` 为 `true` 时，获取不到对应 DOM 的高亮请求 SHALL 被丢弃且不进入高亮计算队列；已在队列中的记录或其 DOM 在计算过程中消失时 MUST 从队列中移除。

#### Scenario: 不可见行的高亮被丢弃

- **WHEN** 对当前未渲染（如虚拟滚动视口外）的行调用高亮且传入 `ignoreInvisible: true`
- **THEN** 该高亮请求被丢弃，不占用后续动画计算资源
