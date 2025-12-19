# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**thgraph** 是一个现代化的 TypeScript 5 图形引擎，对 mxGraph 的完全重写。项目采用 monorepo 架构，包含核心引擎（thgraph-next）和 UI 组件库。

## 项目结构

```
thgraph/
├── packages/
│   ├── thgraph/           # ES2020 JavaScript 版本（稳定）
│   └── thgraph-next/       # TypeScript 5 核心引擎（开发中）
│       ├── src/
│           ├── core/                # 核心模块
        │   │   ├── Client.ts        # 新的入口文件
        │   │   ├── Graph.ts         # 主图类
        │   │   ├── GraphModel.ts    # 数据模型
        │   │   └── GraphView.ts     # 视图组件
        │   ├── model/               # 数据模型
        │   │   ├── Cell.ts          # 单元格类
        │   │   ├── Geometry.ts      # 几何信息
        │   │   └── Stylesheet.ts    # 样式表
        │   ├── view/                # 视图层
        │   │   ├── CellRenderer.ts  # 渲染器
        │   │   ├── CellState.ts     # 单元格状态
        │   │   └── Canvas.ts        # 画布接口
        │   ├── handler/             # 事件处理
        │   │   ├── GraphHandler.ts  # 图形处理
        │   │   ├── ConnectionHandler.ts # 连接处理
        │   │   └── Rubberband.ts    # 框选功能
        │   ├── shape/               # 图形组件
        │   │   ├── Shape.ts         # 基础图形
        │   │   ├── Rectangle.ts     # 矩形
        │   │   └── Connector.ts     # 连接线
        │   ├── layout/              # 布局算法
        │   │   ├── Layout.ts        # 布局基类
        │   │   ├── Hierarchical.ts  # 层次布局
        │   │   └── Organic.ts       # 有机布局
        │   ├── util/                # 工具类
        │   │   ├── Utils.ts         # 通用工具
        │   │   ├── Event.ts         # 事件处理
        │   │   ├── Constants.ts     # 常量定义
        │   │   └── Geometry.ts      # 几何计算
        │   ├── io/                  # 输入输出
        │   │   ├── Codec.ts         # 编解码器
        │   │   └── XmlUtils.ts      # XML工具
        │   ├── editor/              # 编辑器
        │   │   ├── Editor.ts        # 编辑器主类
        │   │   └── Toolbar.ts       # 工具栏
        │   └── styles/              # 样式文件
        │       └── default.css
│       │   └── types/        # TypeScript 类型定义
│       ├── tests/            # 单元测试目录
│       ├── dist/             # 构建输出
│       └── package.json
│   └── thgraph-ui/         # Vue 3 UI 组件（计划中）
└── demos/                  # 演示应用
```

## 开发阶段

### 已完成的阶段

- **Phase 1**: 基础设施与数据模型 ✅
  - 严格的 TypeScript 5 配置
  - 不可变 Cell、Geometry、GraphModel 实现
  - Vitest 测试框架（84% 通过率）

- **Phase 2**: 核心渲染器 ✅
  - 现代 SVG 渲染引擎
  - 坐标转换系统
  - 类型安全的图形注册表

- **Phase 3**: 交互与事件 ✅
  - 类型安全的事件系统
  - 平移、缩放、选择功能
  - 拖拽、调整大小处理

- **Phase 4**: 连线与高级功能 ✅
  - 连接创建与端口约束
  - 5 种边路由算法（直连、正交、曲线、曼哈顿、避障）
  - 完整的撤销/重做系统
  - 命令模式实现

### 进行中的阶段

- **Phase 5**: Vue 3 UI 组件（计划中）

## 常用开发命令

### 在 thgraph-next 目录中

```bash
# 构建项目
pnpm build

# 开发模式（监听文件变化）
pnpm dev

# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test tests/Cell.test.ts
pnpm test tests/GraphModel.test.ts

# 运行测试覆盖率报告
pnpm test:coverage

# 运行交互式测试界面
pnpm test:ui

# 类型检查
pnpm type-check

# 代码质量检查
pnpm lint
pnpm lint:fix

# 生成文档
pnpm doc
```

### 整体项目命令

```bash
# 在根目录
pnpm install           # 安装所有依赖
pnpm test              # 运行所有包的测试
pnpm build             # 构建所有包
pnpm dev                # 开发模式
```

## 核心架构概念

### 数据模型设计
- **不可变对象**: 所有 Cell、Geometry 对象都是不可变的，修改操作创建新实例
- **事务系统**: GraphModel 支持 beginUpdate/endUpdate 事务批处理
- **事件驱动**: 使用 EventEmitter 进行松耦合的事件通信

### 渲染系统
- **SVG 渲染**: 现代浏览器 SVG API，无 VML 遗留代码
- **图形注册表**: 通过工厂模式注册和创建自定义图形
- **坐标转换**: GraphView 处理缩放、平移、屏幕/模型坐标转换

### 交互处理
- **事件系统**: 类型安全的 EventEmitter，支持事件拦截和中间件
- **选择管理**: SelectionModel 支持单选和多选，带事件通知
- **操作处理**: 各类 Handler 专门处理特定交互（拖拽、调整大小、平移缩放）

### 连接与路由
- **连接管理**: ConnectionHandler 处理连接创建、验证、端口约束
- **路由算法**: EdgeRouter 提供 5 种路由算法，支持障碍避让
- **撤销重做**: UndoManager 实现命令模式，支持事务批处理

## 测试策略

### 测试框架
- **Vitest**: 主要测试框架，配置 happy-dom 环境
- **测试覆盖率**: 当前 84% (169/201 测试通过)
- **测试文件**: 位于 `tests/` 目录，按模块组织

### 核心模块测试状态
- **ConnectionHandler**: 18/18 测试通过（100%）
- **EdgeRouter**: 17/17 测试通过（100%）
- **UndoManager**: 22/22 测试通过（100%）
- **其他模块**: 基础功能正常

## 类型系统

### 严格 TypeScript 配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 主要类型定义
- `Cell`: 图形单元（顶点、边、组合）
- `Geometry`: 几何坐标和变换
- `Point`, `Rectangle`: 数学坐标类型
- `GraphModel`: 图模型和事务
- `EventMap`: 类型安全的事件映射

## 构建系统

### tsdown 配置
- **模块化导出**: 支持独立模块导出（model, renderer, interaction 等）
- **ESNext 目标**: 输出现代 JavaScript，支持 tree-shaking
- **类型定义**: 同时生成 .d.ts 文件

### 包导出
```typescript
// 主入口
import { Cell, GraphModel, GraphView } from 'thgraph-next'

// 模块导出
import { GraphModel } from 'thgraph-next/model'
import { SvgRenderer } from 'thgraph-next/renderer'
import { EventEmitter } from 'thgraph-next/interaction'
```

## 注意事项

### 开发约定
- **不可变性**: 所有数据修改通过返回新实例，不要直接修改对象属性
- **事件驱动**: 使用 EventEmitter 进行组件间通信，避免直接依赖
- **类型安全**: 保持严格的 TypeScript 类型检查，避免 any 类型
- **测试覆盖**: 新功能必须包含单元测试，保持 85%+ 覆盖率

### 性能考虑
- **DOM 操作**: SvgRenderer 使用现代 DOM API，避免强制重排
- **事件委托**: 事件处理使用委托模式，减少事件监听器数量
- **内存管理**: Cell 对象使用弱引用和垃圾回收友好模式

### 兼容性
- **Node.js**: 需要 Node.js 18.0.0+
- **浏览器**: 支持现代浏览器（ES2020+）
- **框架**: 框架无关，可与任何前端框架集成