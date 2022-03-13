import{_ as n,c as s,o as a,a as t}from"./app.edf3bf51.js";const y='{"title":"\u8BF4\u660E","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u8BF4\u660E","slug":"\u8BF4\u660E"},{"level":2,"title":"\u6548\u679C","slug":"\u6548\u679C"},{"level":2,"title":"\u4EE3\u7801","slug":"\u4EE3\u7801"}],"relativePath":"demos/hello-world/index.md","lastUpdated":1647136059000}',p={},o=t(`<h2 id="\u8BF4\u660E" tabindex="-1">\u8BF4\u660E <a class="header-anchor" href="#\u8BF4\u660E" aria-hidden="true">#</a></h2><p>Hello, World! example for mxGraph. This example demonstrates using a DOM node to create a graph and adding vertices and edges.</p><h2 id="\u6548\u679C" tabindex="-1">\u6548\u679C <a class="header-anchor" href="#\u6548\u679C" aria-hidden="true">#</a></h2><iframe src="https://codesandbox.io/embed/tg-hello-world-rerwli?fontsize=14&amp;hidenavigation=1&amp;theme=dark" style="width:100%;height:500px;border:0;border-radius:4px;overflow:hidden;" title="tg-hello-world" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe><h2 id="\u4EE3\u7801" tabindex="-1">\u4EE3\u7801 <a class="header-anchor" href="#\u4EE3\u7801" aria-hidden="true">#</a></h2><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> ref<span class="token punctuation">,</span> onMounted <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span>
  mxEvent<span class="token punctuation">,</span>
  mxGraph<span class="token punctuation">,</span>
  mxRubberband<span class="token punctuation">,</span>
  mxConstants<span class="token punctuation">,</span>
  mxUtils<span class="token punctuation">,</span>
  mxPoint<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;thgraph&#39;</span><span class="token punctuation">;</span>

<span class="token function">onMounted</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> container <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;graphContainer&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Disables the built-in context menu</span>
  mxEvent<span class="token punctuation">.</span><span class="token function">disableContextMenu</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Creates the graph inside the given container</span>
  <span class="token keyword">var</span> graph <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">mxGraph</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Sets the base style for all vertices</span>
  <span class="token keyword">var</span> style <span class="token operator">=</span> graph<span class="token punctuation">.</span><span class="token function">getStylesheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getDefaultVertexStyle</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  style<span class="token punctuation">[</span>mxConstants<span class="token punctuation">.</span><span class="token constant">STYLE_ROUNDED</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  style<span class="token punctuation">[</span>mxConstants<span class="token punctuation">.</span><span class="token constant">STYLE_FILLCOLOR</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&#39;#ffffff&#39;</span><span class="token punctuation">;</span>
  style<span class="token punctuation">[</span>mxConstants<span class="token punctuation">.</span><span class="token constant">STYLE_STROKECOLOR</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&#39;#000000&#39;</span><span class="token punctuation">;</span>
  style<span class="token punctuation">[</span>mxConstants<span class="token punctuation">.</span><span class="token constant">STYLE_STROKEWIDTH</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&#39;2&#39;</span><span class="token punctuation">;</span>
  style<span class="token punctuation">[</span>mxConstants<span class="token punctuation">.</span><span class="token constant">STYLE_FONTCOLOR</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&#39;#000000&#39;</span><span class="token punctuation">;</span>
  style<span class="token punctuation">[</span>mxConstants<span class="token punctuation">.</span><span class="token constant">STYLE_FONTSIZE</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&#39;12&#39;</span><span class="token punctuation">;</span>
  style<span class="token punctuation">[</span>mxConstants<span class="token punctuation">.</span><span class="token constant">STYLE_FONTSTYLE</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  graph<span class="token punctuation">.</span><span class="token function">getStylesheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">putDefaultVertexStyle</span><span class="token punctuation">(</span>style<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Removes folding icon for relative children</span>
  graph<span class="token punctuation">.</span><span class="token function-variable function">isCellFoldable</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">cell<span class="token punctuation">,</span> collapse</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> childCount <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">.</span><span class="token function">getChildCount</span><span class="token punctuation">(</span>cell<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> childCount<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> child <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">.</span><span class="token function">getChildAt</span><span class="token punctuation">(</span>cell<span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">var</span> geo <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getCellGeometry</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>geo <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> geo<span class="token punctuation">.</span>relative<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> childCount <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// Returns the relative position of the given child</span>
  <span class="token keyword">function</span> <span class="token function">getRelativePosition</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> dx<span class="token punctuation">,</span> dy</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>state <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> model <span class="token operator">=</span> graph<span class="token punctuation">.</span><span class="token function">getModel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">var</span> geo <span class="token operator">=</span> model<span class="token punctuation">.</span><span class="token function">getGeometry</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>cell<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>geo <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> geo<span class="token punctuation">.</span>relative <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>model<span class="token punctuation">.</span><span class="token function">isEdge</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>cell<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">var</span> parent <span class="token operator">=</span> model<span class="token punctuation">.</span><span class="token function">getParent</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>cell<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>model<span class="token punctuation">.</span><span class="token function">isVertex</span><span class="token punctuation">(</span>parent<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">var</span> pstate <span class="token operator">=</span> graph<span class="token punctuation">.</span>view<span class="token punctuation">.</span><span class="token function">getState</span><span class="token punctuation">(</span>parent<span class="token punctuation">)</span><span class="token punctuation">;</span>

          <span class="token keyword">if</span> <span class="token punctuation">(</span>pstate <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">var</span> scale <span class="token operator">=</span> graph<span class="token punctuation">.</span>view<span class="token punctuation">.</span>scale<span class="token punctuation">;</span>
            <span class="token keyword">var</span> x <span class="token operator">=</span> state<span class="token punctuation">.</span>x <span class="token operator">+</span> dx<span class="token punctuation">;</span>
            <span class="token keyword">var</span> y <span class="token operator">=</span> state<span class="token punctuation">.</span>y <span class="token operator">+</span> dy<span class="token punctuation">;</span>

            <span class="token keyword">if</span> <span class="token punctuation">(</span>geo<span class="token punctuation">.</span>offset <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
              x <span class="token operator">-=</span> geo<span class="token punctuation">.</span>offset<span class="token punctuation">.</span>x <span class="token operator">*</span> scale<span class="token punctuation">;</span>
              y <span class="token operator">-=</span> geo<span class="token punctuation">.</span>offset<span class="token punctuation">.</span>y <span class="token operator">*</span> scale<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            x <span class="token operator">=</span> <span class="token punctuation">(</span>x <span class="token operator">-</span> pstate<span class="token punctuation">.</span>x<span class="token punctuation">)</span> <span class="token operator">/</span> pstate<span class="token punctuation">.</span>width<span class="token punctuation">;</span>
            y <span class="token operator">=</span> <span class="token punctuation">(</span>y <span class="token operator">-</span> pstate<span class="token punctuation">.</span>y<span class="token punctuation">)</span> <span class="token operator">/</span> pstate<span class="token punctuation">.</span>height<span class="token punctuation">;</span>

            <span class="token keyword">if</span> <span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>y <span class="token operator">-</span> <span class="token number">0.5</span><span class="token punctuation">)</span> <span class="token operator">&lt;=</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span><span class="token punctuation">(</span>x <span class="token operator">-</span> <span class="token number">0.5</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
              x <span class="token operator">=</span> x <span class="token operator">&gt;</span> <span class="token number">0.5</span> <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
              y <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
              x <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> x<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
              y <span class="token operator">=</span> y <span class="token operator">&gt;</span> <span class="token number">0.5</span> <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">mxPoint</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// Replaces translation for relative children</span>
  graph<span class="token punctuation">.</span><span class="token function-variable function">translateCell</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">cell<span class="token punctuation">,</span> dx<span class="token punctuation">,</span> dy</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> rel <span class="token operator">=</span> <span class="token function">getRelativePosition</span><span class="token punctuation">(</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>view<span class="token punctuation">.</span><span class="token function">getState</span><span class="token punctuation">(</span>cell<span class="token punctuation">)</span><span class="token punctuation">,</span>
      dx <span class="token operator">*</span> graph<span class="token punctuation">.</span>view<span class="token punctuation">.</span>scale<span class="token punctuation">,</span>
      dy <span class="token operator">*</span> graph<span class="token punctuation">.</span>view<span class="token punctuation">.</span>scale<span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>rel <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> geo <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">.</span><span class="token function">getGeometry</span><span class="token punctuation">(</span>cell<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>geo <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> geo<span class="token punctuation">.</span>relative<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        geo <span class="token operator">=</span> geo<span class="token punctuation">.</span><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        geo<span class="token punctuation">.</span>x <span class="token operator">=</span> rel<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
        geo<span class="token punctuation">.</span>y <span class="token operator">=</span> rel<span class="token punctuation">.</span>y<span class="token punctuation">;</span>

        <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">.</span><span class="token function">setGeometry</span><span class="token punctuation">(</span>cell<span class="token punctuation">,</span> geo<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      mxGraph<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function">translateCell</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> arguments<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// Replaces move preview for relative children</span>
  graph<span class="token punctuation">.</span>graphHandler<span class="token punctuation">.</span><span class="token function-variable function">getDelta</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">me</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> point <span class="token operator">=</span> mxUtils<span class="token punctuation">.</span><span class="token function">convertPoint</span><span class="token punctuation">(</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>graph<span class="token punctuation">.</span>container<span class="token punctuation">,</span>
      me<span class="token punctuation">.</span><span class="token function">getX</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      me<span class="token punctuation">.</span><span class="token function">getY</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> delta <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">mxPoint</span><span class="token punctuation">(</span>point<span class="token punctuation">.</span>x <span class="token operator">-</span> <span class="token keyword">this</span><span class="token punctuation">.</span>first<span class="token punctuation">.</span>x<span class="token punctuation">,</span> point<span class="token punctuation">.</span>y <span class="token operator">-</span> <span class="token keyword">this</span><span class="token punctuation">.</span>first<span class="token punctuation">.</span>y<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>cells <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>cells<span class="token punctuation">.</span>length <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>cells<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> state <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>graph<span class="token punctuation">.</span>view<span class="token punctuation">.</span><span class="token function">getState</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>cells<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">var</span> rel <span class="token operator">=</span> <span class="token function">getRelativePosition</span><span class="token punctuation">(</span>state<span class="token punctuation">,</span> delta<span class="token punctuation">.</span>x<span class="token punctuation">,</span> delta<span class="token punctuation">.</span>y<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>rel <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">var</span> pstate <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>graph<span class="token punctuation">.</span>view<span class="token punctuation">.</span><span class="token function">getState</span><span class="token punctuation">(</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>graph<span class="token punctuation">.</span>model<span class="token punctuation">.</span><span class="token function">getParent</span><span class="token punctuation">(</span>state<span class="token punctuation">.</span>cell<span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>pstate <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          delta <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">mxPoint</span><span class="token punctuation">(</span>
            pstate<span class="token punctuation">.</span>x <span class="token operator">+</span> pstate<span class="token punctuation">.</span>width <span class="token operator">*</span> rel<span class="token punctuation">.</span>x <span class="token operator">-</span> state<span class="token punctuation">.</span><span class="token function">getCenterX</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
            pstate<span class="token punctuation">.</span>y <span class="token operator">+</span> pstate<span class="token punctuation">.</span>height <span class="token operator">*</span> rel<span class="token punctuation">.</span>y <span class="token operator">-</span> state<span class="token punctuation">.</span><span class="token function">getCenterY</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> delta<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// Relative children cannot be removed from parent</span>
  graph<span class="token punctuation">.</span>graphHandler<span class="token punctuation">.</span><span class="token function-variable function">shouldRemoveCellsFromParent</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span>
    <span class="token parameter">parent<span class="token punctuation">,</span>
    cells<span class="token punctuation">,</span>
    evt<span class="token punctuation">,</span></span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span>
      cells<span class="token punctuation">.</span>length <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span>
      <span class="token operator">!</span>cells<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>geometry<span class="token punctuation">.</span>relative <span class="token operator">&amp;&amp;</span>
      mxGraphHandler<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function">shouldRemoveCellsFromParent</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span>
        <span class="token keyword">this</span><span class="token punctuation">,</span>
        arguments<span class="token punctuation">,</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// Enables moving of relative children</span>
  graph<span class="token punctuation">.</span><span class="token function-variable function">isCellLocked</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">cell</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// Enables rubberband selection</span>
  <span class="token keyword">new</span> <span class="token class-name">mxRubberband</span><span class="token punctuation">(</span>graph<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Gets the default parent for inserting new cells. This</span>
  <span class="token comment">// is normally the first child of the root (ie. layer 0).</span>
  <span class="token keyword">var</span> parent <span class="token operator">=</span> graph<span class="token punctuation">.</span><span class="token function">getDefaultParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Adds cells to the model in a single step</span>
  graph<span class="token punctuation">.</span><span class="token function">getModel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">beginUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> v1 <span class="token operator">=</span> graph<span class="token punctuation">.</span><span class="token function">insertVertex</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token string">&#39;Process&#39;</span><span class="token punctuation">,</span> <span class="token number">60</span><span class="token punctuation">,</span> <span class="token number">60</span><span class="token punctuation">,</span> <span class="token number">90</span><span class="token punctuation">,</span> <span class="token number">40</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> v2 <span class="token operator">=</span> graph<span class="token punctuation">.</span><span class="token function">insertVertex</span><span class="token punctuation">(</span>
      v1<span class="token punctuation">,</span>
      <span class="token keyword">null</span><span class="token punctuation">,</span>
      <span class="token string">&#39;in&#39;</span><span class="token punctuation">,</span>
      <span class="token number">0</span><span class="token punctuation">,</span>
      <span class="token number">0.5</span><span class="token punctuation">,</span>
      <span class="token number">20</span><span class="token punctuation">,</span>
      <span class="token number">20</span><span class="token punctuation">,</span>
      <span class="token string">&#39;fontSize=9;shape=ellipse;resizable=0;&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    v2<span class="token punctuation">.</span>geometry<span class="token punctuation">.</span>offset <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">mxPoint</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    v2<span class="token punctuation">.</span>geometry<span class="token punctuation">.</span>relative <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> v3 <span class="token operator">=</span> graph<span class="token punctuation">.</span><span class="token function">insertVertex</span><span class="token punctuation">(</span>
      v1<span class="token punctuation">,</span>
      <span class="token keyword">null</span><span class="token punctuation">,</span>
      <span class="token string">&#39;out&#39;</span><span class="token punctuation">,</span>
      <span class="token number">1</span><span class="token punctuation">,</span>
      <span class="token number">0.5</span><span class="token punctuation">,</span>
      <span class="token number">20</span><span class="token punctuation">,</span>
      <span class="token number">20</span><span class="token punctuation">,</span>
      <span class="token string">&#39;fontSize=9;shape=ellipse;resizable=0;&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    v3<span class="token punctuation">.</span>geometry<span class="token punctuation">.</span>offset <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">mxPoint</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    v3<span class="token punctuation">.</span>geometry<span class="token punctuation">.</span>relative <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
    <span class="token comment">// Updates the display</span>
    graph<span class="token punctuation">.</span><span class="token function">getModel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">endUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>graphContainer<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>less<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token style"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>
</code></pre></div>`,6),e=[o];function c(u,l,k,i,r,d){return a(),s("div",null,e)}var g=n(p,[["render",c]]);export{y as __pageData,g as default};
