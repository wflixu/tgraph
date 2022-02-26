# thgraph

mxgraph 已经不在维护，学习 jgraph/mxgraph 源码，准备TS 重构，去掉旧浏览器的兼容代码，面向现代浏览器。
因为项目代码是在太多了，一次完成转化不现实，现在的策略是，先转成esmodule 然后，能和主流框架 vue react以及vite/webpack 一起配合使用, 后续重构和优化. 

[mxgraph代码库](https://github.com/jgraph/mxgraph-js)


# 计划

- [x] 跑通 helloworld 示例
- [x] 转化成esmodule 模块
- [ ] 示例网站
- [ ] 继续重构
- [ ] 优化TS类型



# 文档
目前只是把mxgraph 转换成esmodule，所以之前全局变量，引入后就能用了。

[新文档](https://wflixu.github.io/tgraph/)

## helloworld

``` javascript
    //
    import { mxGraph ,mxRubberband} from 'thgraph';


     const container = document.getElementById('graphContainer');
    // Creates the graph inside the given container
    const graph = new mxGraph(container);

    // Enables rubberband selection
    new mxRubberband(graph);

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    const parent = graph.getDefaultParent();

    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();
    try {
      const v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
      const v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
      const e1 = graph.insertEdge(parent, null, '', v1, v2);
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }

```


其他可以参看mxgraph 文档

[mxgraph文档](https://jgraph.github.io/mxgraph/);



## 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


