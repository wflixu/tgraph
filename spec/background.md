jgraph/mxgraph 是图编辑器 drawio 底层核心，但是这个库已经不维护了，代码使用比较老旧的js 写的，有很多代码都是为了处理浏览器兼容问题，代码变了都放到window 下，没有模块化。我现在想用typescript 5 重写这个代码库，模块化，分成 core 和 uilib，core 专注图编辑器，框架无关；UILib 是编辑器的一些常用组件，目前准用vue3 实现，后续再适配其他框架。这次优化要去掉浏览器的兼容代码，支持最新的chrome 就行.
目前的进展：
packages/thgraph 是把 jgraph/mxgraph 改为 ES2020 的代码，已经可以运行了，是我初步的尝试

packages/thgraph-next 是TS 版本，是最终开发，发布维护的版本。
