

<script >
import { ref, onMounted, defineProps, reactive, watch } from 'vue';
import closeGif from './../assets/images/close.gif';
import minimizeGif from './../assets/images/minimize.gif';
import maximizeGif from './../assets/images/maximize.gif';
import normalizeGif from './../assets/images/normalize.gif';

import { useMouseInElement, useMouse } from '@vueuse/core';
export default {
  props: {
    title: {
      type: String,
      default: '窗口',
    },
    minimizable: {
      type: Boolean,
      default: true,
    },
    movable: {
      type: Boolean,
      default: true,
    },
    x: {
      type: Number,
      default: 200,
    },
    y: {
      type: Number,
      default: 100,
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 300,
    },
    classes: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      moving: false,
      pos: {
        offsetX: 0,
        offsetY: 0,
      },
      closeGif,
      maximizeGif,
      minimizeGif,
      normalizeGif,
      visible:false,

    };
  },
  mounted() {
    this.initStyle();
    if (this.movable) {
      this.installMoveHandler();
    }
  },
  unmounted() {
    window.removeEventListener('mousemove', this.onMousemove);
  },

  methods: {
    hide(){

    },
    initStyle() {
      this.$refs.mxwin.style.left = this.x + 'px';
      this.$refs.mxwin.style.top = this.y + 'px';
      this.$refs.mxwin.style.width = this.width + 'px';
      this.$refs.mxwin.style.height = this.height + 'px';
    },
    installMoveHandler() {
      window.addEventListener('mousemove', this.onMousemove);
    },
    onMouseDown(evt) {
      this.pos.offsetX = evt.offsetX;
      this.pos.offsetY = evt.offsetY;
      this.moving = true;
    },
    onMouseup(evt) {
      this.moving = false;
    },
    onMousemove(e) {
      if (this.moving) {
        let { clientX, clientY } = e;
        this.$refs.mxwin.style.left = clientX - this.pos.offsetX + 'px';
        this.$refs.mxwin.style.top = clientY - this.pos.offsetY + 'px';
      }
    },
  },
};
</script>

<template>
  <teleport to="body">
    <div class="mx-window" ref="mxwin" :class="classes">
      <div
        class="mx-window-header"
        @mousedown="onMouseDown"
        @mouseup="onMouseup"
      >
        <div class="mx-window-header-title">
          {{ title }}
        </div>
        <div class="mx-window-header-actions mr-2">
          <img :src="maximizeGif" alt="" class="action" />
          <img :src="normalizeGif" alt="" class="action" />
          <img :src="minimizeGif" alt="" class="action" />
          <img :src="closeGif" alt="" class="action" />
        </div>
      </div>
      <div class="mx-window-body">
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<style lang="less">
.mx-window {
  box-shadow: 3px 3px 12px #c0c0c0;
  background: url(data:image/gif;base64,R0lGODlhGgAUAIAAAOzs7PDw8CH5BAAAAAAALAAAAAAaABQAAAIijI+py70Ao5y02lud3lzhD4ZUR5aPiKajyZbqq7YyB9dhAQA7);
  border: 1px solid #c3c3c3;
  position: fixed;
  top: 50%;
  left: 50%;
  // transform: translate(-50%, -50%);
  overflow: hidden;
  z-index: 1;
  width: 600px;
  height: 300px;
  .mx-window-header {
    background: url(data:image/gif;base64,R0lGODlhFwAXAMQAANfX18rKyuHh4c7OzsDAwMHBwc/Pz+Li4uTk5NHR0dvb2+jo6O/v79/f3/n5+dnZ2dbW1uPj44yMjNPT0+Dg4N3d3ebm5szMzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAAXABcAAAWQICESxWiW5Ck6bOu+MMvMdG3f86LvfO/rlqBwSCwaj8ikUohoOp/QaDNCrVqvWKpgezhsv+AwmEIum89ocmPNbrvf64p8Tq/b5Yq8fs/v5x+AgYKDhIAAh4iJiouHEI6PkJGSjhOVlpeYmZUJnJ2en6CcBqMDpaanqKgXq6ytrq+rAbKztLW2shK5uru8vbkhADs=)
      repeat-x;
    height: 24px;
    display: flex;
    align-items: center;
    .mx-window-header-title {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: move;
      user-select: none;
    }
    .mx-window-header-actions {
      margin-right: 8px;
      img {
        margin-left: 6px;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
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