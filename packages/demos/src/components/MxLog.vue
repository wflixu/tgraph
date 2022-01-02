<template>
  <div>
    <mx-window
      :title="title"
      :visible="visible"
      :x="x"
      :y="y"
      :height="height"
      :width="width"
    >
      <div>
        <textarea
          ref="textarea"
          name=""
          id=""
          style="height: 100%; width: 100%; resize: none"
          readonly="true"
          wrap="false"
          :value="text"
        ></textarea>
      </div>
      <div>
        <button class="info" @click="onInfo">Info</button>
        <button class="dom" @click="onDom">DOM</button>
        <button class="trace" @click="onTrace">Trace</button>
        <button class="copy" @click="onCopy">Copy</button>
        <button class="show" @click="onShow">Show</button>
        <button class="Clear" @click="text = ''">Clear</button>
        <slot></slot>
      </div>
    </mx-window>
  </div>
</template>

<script>
import MxWindow from './MxWindow.vue';
import { mxUtils, mxClient } from 'thgraph';
export default {
  components: {
    MxWindow,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    val: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /**
       * Class: mxLog
       *
       * A singleton class that implements a simple console.
       *
       * Variable: consoleName
       *
       * Specifies the name of the console window. Default is 'Console'.
       */
      consoleName: 'Console',

      /**
       * Variable: TRACE
       *
       * Specified if the output for <enter> and <leave> should be visible in the
       * console. Default is false.
       */
      TRACE: false,

      /**
       * Variable: DEBUG
       *
       * Specifies if the output for <debug> should be visible in the console.
       * Default is true.
       */
      DEBUG: true,

      /**
       * Variable: WARN
       *
       * Specifies if the output for <warn> should be visible in the console.
       * Default is true.
       */
      WARN: true,

      /**
       * Variable: buffer
       *
       * Buffer for pre-initialized content.
       */
      buffer: '',
      // texteara value
      text: '',
      visible: true,
      buttons: [
        {
          label: '',
        },
      ],
      title: '',
      x: 0,
      y: 0,
      width: 300,
      height: 160,
    };
  },
  created() {
    this.text = this.value;
  },
  methods: {
    /**
     * Function: init
     *
     * Initializes the DOM node for the console. This requires document.body to
     * point to a non-null value. This is called from within <setVisible> if the
     * log has not yet been initialized.
     */
    onInfo() {
      this.writeln(mxUtils.toString(navigator));
    },
    onDom() {
      var content = mxUtils.getInnerHtml(document.body);
      this.debug(content);
    },
    onTrace() {
      this.TRACE = !this.TRACE;

      if (this.TRACE) {
        this.debug('Tracing enabled');
      } else {
        this.debug('Tracing disabled');
      }
    },

    onCopy() {
      try {
        mxUtils.copy(this.text);
      } catch (err) {
        mxUtils.alert(err);
      }
    },

    onShow() {
      try {
        mxUtils.popup(this.text);
      } catch (err) {
        mxUtils.alert(err);
      }
    },

    init() {
      this.title = this.consoleName + ' - mxGraph ' + mxClient.VERSION;

      // Cross-browser code to get window size
      var h = 0;
      var w = 0;

      if (typeof window.innerWidth === 'number') {
        h = window.innerHeight;
        w = window.innerWidth;
      } else {
        h = document.documentElement.clientHeight || document.body.clientHeight;
        w = document.body.clientWidth;
      }
      this.width = Math.max(0, w - 320);
      this.height = Math.max(0, h - 210);
    },

    /**
     * Function: info
     *
     * Writes the current navigator information to the console.
     */
    info() {
      this.writeln(mxUtils.toString(navigator));
    },

    /**
     * Function: isVisible
     *
     * Returns true if the console is visible.
     */
    isVisible() {
      return this.visible;
    },

    /**
     * Function: show
     *
     * Shows the console.
     */
    show() {
      this.setVisible(true);
    },

    /**
     * Function: setVisible
     *
     * Shows or hides the console.
     */
    setVisible(visible) {
      if (this.window == null) {
        this.init();
      }
      this.visible = visible;
    },

    /**
     * Function: enter
     *
     * Writes the specified string to the console
     * if <TRACE> is true and returns the current
     * time in milliseconds.
     *
     * Example:
     *
     * (code)
     * mxLog.show();
     * var t0 = mxLog.enter('Hello');
     * // Do something
     * mxLog.leave('World!', t0);
     * (end)
     */
    enter(string) {
      if (this.TRACE) {
        this.writeln('Entering ' + string);
        return new Date().getTime();
      }
    },

    /**
     * Function: leave
     *
     * Writes the specified string to the console
     * if <TRACE> is true and computes the difference
     * between the current time and t0 in milliseconds.
     * See <enter> for an example.
     */
    leave(string, t0) {
      if (this.TRACE) {
        var dt = t0 != 0 ? ' (' + (new Date().getTime() - t0) + ' ms)' : '';
        this.writeln('Leaving ' + string + dt);
      }
    },

    /**
     * Function: debug
     *
     * Adds all arguments to the console if <DEBUG> is enabled.
     *
     * Example:
     *
     * (code)
     * mxLog.show();
     * mxLog.debug('Hello, World!');
     * (end)
     */
    debug(...args) {
      if (this.DEBUG) {
        this.writeln(...args);
      }
    },

    /**
     * Function: warn
     *
     * Adds all arguments to the console if <WARN> is enabled.
     *
     * Example:
     *
     * (code)
     * this.show();
     * this.warn('Hello, World!');
     * (end)
     */
    warn(...args) {
      if (this.WARN) {
        this.writeln(...args);
      }
    },

    /**
     * Function: write
     *
     * Adds the specified strings to the console.
     */
    write(...args) {
      var str = '';

      for (var i = 0; i < args.length; i++) {
        str += args[i];

        if (i < args.length - 1) {
          str += ' ';
        }
      }

      const textarea = this.$refs.textarea;

      if (textarea) {
        this.text += str;
        textarea.scrollTop = textarea.scrollHeight;
      } else {
        this.buffer += string;
      }
    },

    /**
     * Function: writeln
     *
     * Adds the specified strings to the console, appending a linefeed at the
     * end of each string.
     */
    writeln(...args) {
      var string = '';

      for (var i = 0; i < args.length; i++) {
        string += args[i];

        if (i < args.length - 1) {
          string += ' ';
        }
      }

      this.write(string + '\n');
    },
  },
};
</script>

<style lang="less" scoped>
</style>