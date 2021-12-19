# tgraph

## 介绍
mxgraph 已经不在维护，学习 jgraph/mxgraph 源码，TS 重构，去掉旧浏览器的兼容代码，面向现代浏览器。

https://github.com/jgraph/mxgraph-js

## 计划

- [ ] 转化成esmodule 模块
- [x] 跑通 helloworld 示例
- [ ] 示例网站
- [ ] 继续重构
- [ ] 优化TS 类型

### 目录结构

├── LICENSE
├── README.en.md
├── README.md
├── docs  // 文档
│   ├── API
│   ├── index.md
│   └── tutorial
├── graph  // 源码
│   ├── assets
│   ├── editor
│   ├── handler
│   ├── index.js
│   ├── index.ts
│   ├── io
│   ├── layout
│   ├── model
│   ├── mxClient.js
│   ├── mxClient.ts
│   ├── shape
│   ├── types.ts
│   ├── util
│   └── view
├── graph.svg
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── src  // 测试用例
│   ├── App.vue
│   ├── Layout.vue
│   ├── assets
│   ├── components
│   ├── demos
│   ├── main.js
│   ├── routes.js
│   └── style
├── tsconfig.json
└── vite.config.js


### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


