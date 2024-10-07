# thgraph

mxgraph is a popular JavaScript library for creating interactive graphs , and it used by many popular tools like draw.io, but it is no longer maintained.  mxgraph not support modern ES module, and it not work with building tools like vite/webpack.

So I want to learn mxgraph source code, and rewrite it with modern ES module, and remove old browser compatibility code. I will try to make it work with vue/react and vite/webpack.


[mxgraph-js source code](https://github.com/jgraph/mxgraph-js)


# plan
- [x] run pass helloworld demo 
- [x] convert to ES Module
- [x] demos website
- [ ] remove old browser compatibility code
- [ ] using TS refactor code 

# using

```
   # install with pnpm 
   pnpm install thgraph

   # build youself
   pnpm build

   # run demos 
   pnpm demos

   # docs
   pnpm docs:dev
  
   # build docs
   pnpm docs:build


```

# documents

A new document for thgraph using vue3 and vite. 

[new document](https://wflixu.github.io/tgraph/)

## helloworld

``` javascript
    // deps
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

Your also can see the old  mxgraph-js document for more details.

[mxgraph-js document](https://jgraph.github.io/mxgraph/)





