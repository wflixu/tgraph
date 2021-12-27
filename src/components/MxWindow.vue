

<script setup>
import { ref, onMounted } from 'vue';
</script>

<template>
  <teleport to="body">
    <div class="mx-window">
      <h1>mxwindow</h1>
    </div>
  </teleport>
</template>

<style  scoped lang="less">
.mx-window {
  box-shadow: 3px 3px 12px #c0c0c0;
  background: url(data:image/gif;base64,R0lGODlhGgAUAIAAAOzs7PDw8CH5BAAAAAAALAAAAAAaABQAAAIijI+py70Ao5y02lud3lzhD4ZUR5aPiKajyZbqq7YyB9dhAQA7);
  border: 1px solid #c3c3c3;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  z-index: 1;
  width: 600px;
  height: 300px;
}

table.mxWindow {
  border-collapse: collapse;
  table-layout: fixed;
  font-family: Arial;
  font-size: 8pt;
}
td.mxWindowTitle {
  background: url(data:image/gif;base64,R0lGODlhFwAXAMQAANfX18rKyuHh4c7OzsDAwMHBwc/Pz+Li4uTk5NHR0dvb2+jo6O/v79/f3/n5+dnZ2dbW1uPj44yMjNPT0+Dg4N3d3ebm5szMzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAXABcAAAWQICESxWiW5Ck6bOu+MMvMdG3f86LvfO/rlqBwSCwaj8ikUohoOp/QaDNCrVqvWKpgezhsv+AwmEIum89ocmPNbrvf64p8Tq/b5Yq8fs/v5x+AgYKDhIAAh4iJiouHEI6PkJGSjhOVlpeYmZUJnJ2en6CcBqMDpaanqKgXq6ytrq+rAbKztLW2shK5uru8vbkhADs=)
    repeat-x;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-weight: bold;
  overflow: hidden;
  height: 13px;
  padding: 2px;
  padding-top: 4px;
  padding-bottom: 6px;
  color: black;
}
td.mxWindowPane {
  vertical-align: top;
  padding: 0px;
}
div.mxWindowPane {
  overflow: hidden;
  position: relative;
}
td.mxWindowPane td {
  font-family: Arial;
  font-size: 8pt;
}
td.mxWindowPane input,
td.mxWindowPane select,
td.mxWindowPane textarea,
td.mxWindowPane radio {
  border-color: #8c8c8c;
  border-style: solid;
  border-width: 1px;
  font-family: Arial;
  font-size: 8pt;
  padding: 1px;
}
td.mxWindowPane button {
  background: url(data:image/gif;base64,R0lGODlhCgATALMAAP7+/t7e3vj4+Ojo6OXl5e/v7/n5+fb29vPz8/39/e3t7fHx8e7u7v///wAAAAAAACH5BAAAAAAALAAAAAAKABMAAAQ2MMlJhb0Y6c2X/2AhjiRjnqiirizqMkEsz0Rt30Ou7y8K/ouDcEg0GI9IgHLJbDif0Kh06owAADs=)
    repeat-x;
  font-family: Arial;
  font-size: 8pt;
  padding: 2px;
  float: left;
}
</style>