# thgraph 开发计划

## 项目概述

本项目旨在将 mxGraph 重构为现代化的 TypeScript 5 图编辑引擎，提供框架无关的核心库（thgraph-next）和 Vue 3 UI 组件库（thgraph-ui）。

## 当前状态

### 已有包
- **packages/thgraph**: ES2020 JavaScript 版本（可用但遗留代码）
- **packages/thgraph-next**: 部分 TypeScript 实现（基础结构，类型宽松）
- **packages/demos**: 演示应用
- **packages/docs**: VitePress 文档

### 存在的问题
1. TypeScript 使用较少，大量 `any` 类型
2. 仍存在浏览器兼容代码
3. 构建系统未针对现代 ESNext 优化
4. 严格的类型检查未启用
5. 功能实现不完整

## 目标架构

### 包结构
```
packages/
├── thgraph-next/          # 核心图引擎（TypeScript 5）
│   ├── src/
│   │   ├── model/         # Cell, Geometry, GraphModel, Style
│   │   ├── view/          # GraphView, 坐标管理
│   │   ├── renderer/      # SVG 渲染引擎
│   │   ├── interaction/   # 事件处理，选择，操作
│   │   ├── layout/        # 布局算法
│   │   ├── io/           # JSON 序列化，XML 转换器
│   │   ├── util/         # 工具函数，常量，数学
│   │   └── types/        # 完整的 TypeScript 类型定义
│   ├── tsdown.config.ts   # 现代构建配置
│   ├── vitest.config.ts   # 测试配置
│   └── package.json
│
└── thgraph-ui/            # Vue 3 UI 组件
    ├── src/
    │   ├── components/    # GraphContainer, Toolbar, Properties 等
    │   ├── composables/   # useGraph, useSelection 等
    │   └── styles/       # css var
    ├── vite.config.ts     # Vue 组件的 Vite 配置
    └── package.json
```

### 技术栈
- **语言**: TypeScript 5.x（严格模式）
- **构建**: tsdown（核心），Vite（Vue UI）
- **测试**: Vitest（目标 90%+ 覆盖率）
- **打包**: ESNext 输出，支持 tree-shaking
- **CSS**: UI 组件使用 原生 CSS，通过css var css next 

## 开发阶段

### Phase 1: 基础设施与数据模型（第 1-2 周）

#### 目标
- 建立现代开发基础设施
- 实现具有严格类型的核心数据模型
- 建立全面的测试框架

#### 任务清单
- [ ] 创建 `thgraph-next` 包的 tsdown 配置
- [ ] 配置 TypeScript 5.x 严格模式
- [ ] 设置 Vitest 和 DOM 测试工具
- [ ] 配置 ESLint 严格的 TypeScript 规则
- [ ] 实现 `Cell` 接口（不可变 ID 系统）
- [ ] 创建 `Geometry` 类（精确坐标类型）
- [ ] 构建 `GraphModel`（事务支持）
- [ ] 实现类型安全的样式系统
- [ ] 为所有模型类编写单元测试
- [ ] 性能基准测试（大型图）

#### 关键文件
- `packages/thgraph-next/tsconfig.json`（strict: true）
- `packages/thgraph-next/src/model/Cell.ts`
- `packages/thgraph-next/src/model/GraphModel.ts`
- `packages/thgraph-next/src/types/index.ts`

### Phase 2: 核心渲染器（第 3-4 周）

#### 目标
- 构建现代 SVG 渲染引擎
- 实现坐标转换系统
- 创建带类型的图形注册表

#### 任务清单
- [ ] 创建 `SvgRenderer` 类（现代 DOM API）
- [ ] 移除所有 VML/遗留浏览器代码
- [ ] 实现高效的 DOM 操作模式
- [ ] 支持通过注册表添加自定义图形
- [ ] 实现精确的坐标转换
- [ ] 处理缩放、平移和视图缩放
- [ ] 创建不可变的 `Point` 和 `Rectangle` 类
- [ ] 实现基础图形（矩形、椭圆、文本、图片）
- [ ] 创建类型安全的图形注册表

#### 关键文件
- `packages/thgraph-next/src/renderer/SvgRenderer.ts`
- `packages/thgraph-next/src/view/GraphView.ts`
- `packages/thgraph-next/src/shape/registry.ts`

### Phase 3: 交互与事件（第 5-6 周）

#### 目标
- 实现类型安全的事件系统
- 添加平移、缩放和选择功能
- 创建单元操作处理器

#### 任务清单
- [ ] 构建强类型的 EventEmitter
- [ ] 实现事件委托（性能优化）
- [ ] 添加事件拦截中间件
- [ ] 实现平移和缩放功能
- [ ] 创建选择模型（支持多选）
- [ ] 实现单元移动和调整大小
- [ ] 添加框选功能

#### 关键文件
- `packages/thgraph-next/src/event/EventEmitter.ts`
- `packages/thgraph-next/src/interaction/SelectionModel.ts`
- `packages/thgraph-next/src/interaction/PanZoom.ts`

### Phase 4: 连线与高级功能（第 7-8 周）

#### 目标
- 实现边创建和路由
- 添加撤销/重做功能
- 处理复杂的图操作

#### 任务清单
- [ ] 连接创建（端口约束）
- [ ] 边路由算法（正交、曲线）
- [ ] 端点处理和吸附
- [ ] 路点管理
- [ ] 实现命令模式（撤销/重做）
- [ ] 事务批处理
- [ ] 历史记录管理
- [ ] 大型图的虚拟渲染
- [ ] 高效的变更跟踪
- [ ] 单元生命周期内存管理

#### 关键文件
- `packages/thgraph-next/src/edge/ConnectionHandler.ts`
- `packages/thgraph-next/src/edge/EdgeRouter.ts`
- `packages/thgraph-next/src/undo/UndoManager.ts`

### Phase 5: Vue 3 UI 组件（第 9-10 周）

#### 目标
- 创建 Vue 3 组件库
- 实现响应式状态管理
- 构建完整的编辑器界面

#### 任务清单
- [ ] 创建 `thgraph-ui` 包
- [ ] 配置 Vite for Vue 组件
- [ ] 实现 `GraphContainer` 组件
- [ ] 创建 `Toolbar` 组件
- [ ] 实现 `Sidebar` 组件
- [ ] 创建 `PropertiesPanel` 组件
- [ ] 实现 `MiniMap` 组件
- [ ] 创建 composables（useGraph, useSelection 等）
- [ ] 添加主题支持（亮色/暗色，使用 css var 实现

#### 关键文件
- `packages/thgraph-ui/src/components/GraphContainer.vue`
- `packages/thgraph-ui/src/composables/useGraph.ts`
- `packages/thgraph-ui/src/styles/theme.css`

## 迁移策略

### 处理现有代码

#### thgraph（ES2020 版本）
- 保留作为参考实现
- 迁移期间用于验证
- 提取经过验证的算法和模式
- 功能对等后逐步弃用

#### thgraph-next（部分 TypeScript）
- 挽救结构良好的实现
- 全面改进类型
- 移除 Th 前缀（更简洁的 API）
- 重写类型较弱的组件

### 兼容性层
创建 `thgraph-legacy` 包帮助现有用户迁移：
- 常见 mxGraph 模式的 API 适配器
- 旧文件的 XML 到 JSON 转换器
- 带代码示例的迁移指南

## 质量保证

### 测试策略
1. **单元测试**
   - 所有核心逻辑使用 Vitest
   - 要求 90%+ 代码覆盖率
   - 使用 fast-check 进行基于属性的测试
   - TypeScript 正确性的类型级测试

2. **集成测试**
   - 端到端图操作
   - 事件处理验证
   - 性能基准测试
   - 内存泄漏检测

3. **视觉测试**
   - 与参考的渲染比较
   - 自动化截图测试
   - 跨浏览器验证
   - 可访问性合规

### 文档
1. **API 文档**
   - 带交互示例的 TypeDoc
   - 所有公共 API 的 JSDoc 注释
   - 从 mxGraph 迁移的指南
   - 最佳实践文档

2. **开发者文档**
   - 零配置设置指南
   - 架构决策记录（ADR）
   - 性能调优指南
   - 贡献指南

## 风险缓解

### 技术风险
1. **坐标系统复杂性**
   - 缓解：大量边界案例测试
   - 参考：现有的 thgraph 实现

2. **大型图的性能**
   - 缓解：虚拟渲染，高效算法
   - 监控：持续基准测试

3. **Vue 响应式性能**
   - 缓解：核心保持不可变，仅 UI 响应式
   - 模式：事件同步状态

### 项目风险
1. **范围蔓延**
   - 缓解：严格遵守 PRD 阶段
   - 审查：每周范围验证

2. **兼容性问题**
   - 缓解：全面测试套件
   - 策略：功能标志渐进推出

## 成功指标

### 技术指标
- TypeScript 覆盖率：100%（严格模式）
- 测试覆盖率：核心逻辑 90%+
- 包大小：核心压缩后 < 100KB
- 性能：1000 个单元渲染 < 16ms

### 采用指标
- API 简单性：创建基本图 < 10 行代码
- 迁移便利性：简单 mxGraph 项目 < 1 天
- 文档完整性：100% API 覆盖

## 立即行动

### 第 1 周
1. 创建包结构（thgraph-next, thgraph-ui）
2. 配置 TypeScript 严格模式
3. 开始 Phase 1 实现
4. 设置开发和 CI/CD 流程

### 关键决策
- Vue 组件架构具体细节
- DOM 依赖功能的测试方法
- 首次发布的功能优先级

## 里程碑

- **第 2 周**: 带测试的工作数据模型
- **第 4 周**: 静态图渲染
- **第 6 周**: 交互式图操作
- **第 8 周**: 与 mxGraph 核心功能完全对等
- **第 10 周**: 完整的 Vue UI 和演示

---

本计划提供了将 mxGraph 现代化的清晰可执行路径，同时保持其强大功能并通过现代 TypeScript 实践改善开发者体验。