
# 🚀 mxGraph Next (重构版) - PRD & 开发计划

## 1. 产品概述 (Product Overview)
本项目旨在创建一个现代化、高性能、类型安全且模块化的图编辑引擎。该引擎将作为 `mxGraph` 的精神继承者，移除所有遗留浏览器兼容代码，采用 **TypeScript 5** 重写，并将核心逻辑（Core）与 UI 呈现（UILib）彻底解耦。

### 核心价值主张
* **现代化 DX:** 提供完整的 TypeScript 类型定义，支持 Tree-shaking，遵循 ES Modules 标准。
* **极致性能:** 移除 IE/Old Edge 等兼容代码，针对现代浏览器（Chrome/Edge/Firefox/Safari）的渲染管线进行优化。
* **架构解耦:** 核心绘图引擎不依赖具体前端框架；UI 组件库提供开箱即用的编辑器体验。

---

## 2. 架构设计 (Architecture)

我们将采用 **Monorepo** 结构（建议使用 `pnpm workspace` 或 `Turborepo`）来管理这两个主要包。

### 📦 1. Core (`@mx-next/core`)
**定位：** 纯 TypeScript 编写的图形引擎，框架无关 (Framework Agnostic)。
* **职责：**
    * **Model:** 管理图数据模型（Cells, Geometry, Styles）。
    * **View:** 计算布局、样式解析、渲染状态管理。
    * **Renderer:** 基于 SVG 的渲染器（直接操作 DOM 或使用轻量级 SVG 库，不依赖 Vue/React）。
    * **Interaction:** 处理鼠标/触摸事件，坐标转换，拖拽、缩放、连线逻辑。
    * **Layout:** 核心布局算法（树形、层级等）。
    * **IO:** JSON 序列化/反序列化（替代原本繁重的 XML Codec，但可提供 XML 转换器以兼容旧数据）。

### 🧩 2. UILib (`@mx-next/vue-ui`)
**定位：** 基于 Vue 3 的编辑器组件库，封装 Core 的能力。
* **职责：**
    * 提供 `<GraphContainer />` 组件挂载画布。
    * 提供常用编辑器面板：工具栏 (Toolbar)、侧边栏 (Sidebar)、大纲 (Outline)、属性面板 (Format Panel)。
    * 状态同步：将 Core 的事件（如 `selectionChanged`）映射为 Vue 的响应式数据。

---

## 3. 技术栈规范 (Tech Stack)

| 领域 | 选型 | 备注 |
| :--- | :--- | :--- |
| **语言** | TypeScript 5.x | 开启 `strict: true`，禁止 `any` (尽量) |
| **构建工具** | tsdown | 目标 ESNext，不再转译为 ES5 |
| **包管理** | pnpm | Monorepo 支持 |
| **UI 框架** | Vue 3 (Composition API) | UILib 专用 |
| **CSS** | Tailwind CSS 或 Scoped SCSS | 用于 UI 组件样式 |
| **测试** | Vitest | 单元测试 Core 的算法和逻辑 |
| **渲染技术** | SVG (原生 DOM API) | 保持与 mxGraph 一致的矢量能力，摒弃 VML |

---

## 4. 重构核心策略 (Refactoring Strategy)

这是从老旧 JS 到现代 TS 的关键映射指南：

1.  **全局变量去除:**
    * **Old:** `window.mxGraph`, `window.mxConstants`.
    * **New:** `import { Graph } from '@mx-next/core'`, `import { Constants } from '@mx-next/core'`.
2.  **类继承改造:**
    * **Old:** `mxUtils.extend(mxGraph, mxEventSource)`.
    * **New:** `class Graph extends EventEmitter`.
3.  **事件系统重写:**
    * **Old:** `mxEvent`, `mxEventObject` (弱类型).
    * **New:** 使用泛型强类型的 `EventEmitter` (如 `mitt` 或自研轻量级实现)，例如 `graph.on('click', (evt: CellClickEvent) => {})`.
4.  **DOM 操作简化:**
    * 移除所有 `mxClient.IS_IE`, `mxClient.IS_NS` 等浏览器嗅探代码。
    * 直接使用 `document.querySelector`, `element.classList` 等现代 API。

---

## 5. 开发计划 (Development Roadmap)

建议分为 **5 个阶段 (Milestones)** 进行迭代。

### 📅 Phase 1: 基础设施与数据模型 (Infrastructure & Model)
* **目标：** 建立 Monorepo，实现非可视化的图模型。
* **任务：**
    * [ ] 初始化 pnpm workspace, Vite, Eslint, Prettier。
    * [ ] **Model 重写:** 实现 `Cell` (对应 mxCell), `Geometry` (mxGeometry), `Point` (mxPoint)。
    * [ ] **Tree Structure:** 实现图的父子层级管理、ID 生成策略。
    * [ ] **Style System:** 实现样式解析器（将字符串样式 `'shape=rect;fill=red'` 解析为强类型对象）。
    * [ ] **Unit Test:** 为上述逻辑编写 Vitest 测试。

### 📅 Phase 2: 核心渲染器 (The Renderer)
* **目标：** 能够在页面上画出静态的图形。
* **任务：**
    * [ ] **SVG Factory:** 封装创建 SVG 元素的工具类。
    * [ ] **Shape Registry:** 实现基础图形渲染（矩形、椭圆、文本、Image）。
    * [ ] **Graph View:** 实现 `mxGraphView` 的核心逻辑，计算 Cell 在屏幕上的绝对坐标。
    * [ ] **Painter:** 实现具体的绘制逻辑，将 ViewState 转换为 SVG DOM。
    * [ ] *此阶段产出：一个只读的图表展示 Demo。*

### 📅 Phase 3: 交互与事件 (Interaction & Events)
* **目标：** 让图动起来（拖拽、缩放）。
* **任务：**
    * [ ] **Event Bus:** 实现强类型的事件分发系统。
    * [ ] **Graph Handler:** 实现画布的平移 (Pan) 和缩放 (Zoom)。
    * [ ] **Selection Model:** 实现 `mxGraphSelectionModel`，支持点击选中、框选。
    * [ ] **Move Handler:** 实现 Cell 的拖拽移动。
    * [ ] **Resize Handler:** 实现 Cell 的调整大小（8个控制点）。

### 📅 Phase 4: 连线与高级功能 (Connections & Advanced)
* **目标：** 实现图编辑器的核心——连线。
* **任务：**
    * [ ] **Connection Handler:** 实现连线创建、锚点吸附 (Port constraints)。
    * [ ] **Edge Style:** 实现连线路由算法（直角连线、贝塞尔曲线）。
    * [ ] **Terminal Handling:** 处理连线端点的吸附逻辑。
    * [ ] **Undo/Redo:** 实现 `UndoManager`（命令模式）。

### 📅 Phase 5: Vue 3 UI 组件库 (UILib Integration)
* **目标：** 构建类似 draw.io 的界面。
* **任务：**
    * [ ] **Graph Component:** 封装 `Core` 实例的 Vue 组件。
    * [ ] **Stencil (Sidebar):** 侧边栏组件库，支持拖拽 HTML 元素到画布生成 Cell。
    * [ ] **Properties Panel:** 根据选中 Cell 的数据，双向绑定修改属性。
    * [ ] **MiniMap:** 鹰眼图实现。

---

## 6. 风险与注意事项

1.  **复杂性低估：** `mxGraph` 的坐标转换系统（相对坐标、绝对坐标、滚动偏移、缩放系数）非常复杂。
    * *对策：* 在 Phase 2 重点攻克坐标系数学逻辑，编写大量边界测试用例。
2.  **性能陷阱：** 既然使用 Vue，很容易误用 Vue 的响应式系统去代理整个 `Graph Model`，导致大规模图时性能崩溃。
    * *对策：* **Core 内部保持原生 JS 对象，不要用 Vue 的 ref/reactive 包裹 Graph 实例。** 仅在 UI 组件层通过事件订阅获取需要显示的简单数据。
3.  **兼容性陷阱：** 尽管去掉了浏览器兼容，但需注意 XML 格式的兼容（如果需要打开旧 draw.io 文件）。
    * *对策：* 编写一个独立的 `LegacyXMLConverter`，将旧 XML 转为新的 JSON 结构，而不是让 Core 直接支持 XML。

