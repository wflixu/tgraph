<template>
  <div class="geToolbar">
    <a
      class="geLabel db"
      title="View (Space+Drag to Scroll)"
      style="
        white-space: nowrap;
        overflow: hidden;
        position: relative;
        width: 28px;
      "
      ><div
        class="geSprite geSprite-formatpanel"
        style="margin-left: -4px; margin-top: -3px"
      ></div>
      <img
        border="0"
        style="position: absolute; right: 4px; top: 5px; left: 24px"
        src="data:image/gif;base64,R0lGODlhDQANAIABAHt7e////yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREM1NkJFMjE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREM1NkJFMzE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQzOUMzMjZCMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQzOUMzMjZDMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7"
        valign="middle"
    /></a>

    <div class="geSeparator"></div>

    <a
      class="geLabel"
      title="Zoom (Alt+Mousewheel)"
      style="
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        width: 50px;
      "
      >100%<img
        border="0"
        src="data:image/gif;base64,R0lGODlhDQANAIABAHt7e////yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREM1NkJFMjE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREM1NkJFMzE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQzOUMzMjZCMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQzOUMzMjZDMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7"
        valign="middle"
    /></a>
    <div class="geSeparator"></div>

    <a class="geButton" title="Zoom In (Cmd + (Numpad) / Alt+Mousewheel)"
      ><div class="geSprite geSprite-zoomin"></div
    ></a>
    <a class="geButton" title="Zoom Out (Cmd - (Numpad) / Alt+Mousewheel)"
      ><div class="geSprite geSprite-zoomout"></div
    ></a>
    <div class="geSeparator"></div>

    <a class="geButton mxDisabled" title="Undo (Cmd+Z)"
      ><div class="geSprite geSprite-undo"></div
    ></a>
    <a class="geButton mxDisabled" title="Redo (Cmd+Shift+Z)"
      ><div class="geSprite geSprite-redo"></div
    ></a>

    <div class="geSeparator"></div>
    <a class="geButton mxDisabled" title="Delete (Delete)"
      ><div class="geSprite geSprite-delete"></div
    ></a>
    <div class="geSeparator"></div>
    <a class="geButton mxDisabled" title="To Front (Cmd+Shift+F)"
      ><div class="geSprite geSprite-tofront"></div
    ></a>
    <a class="geButton mxDisabled" title="To Back (Cmd+Shift+B)"
      ><div class="geSprite geSprite-toback"></div
    ></a>
    <div class="geSeparator"></div>
  </div>
</template>

<script>
export default {
  data() {},
};
</script>

<style lang="less" scoped>
.geToolbar {
  padding: 1px 0px 0px 6px;
  border: 1px solid #dadce0;
  -webkit-box-shadow: inset 0 1px 0 0 #fff;
  -moz-box-shadow: inset 0 1px 0 0 #fff;
  box-shadow: inset 0 1px 0 0 #fff;
  display: flex;
  height: 40px;
  align-items: center;

  .geLabel,
  .geButton {
    margin: 2px;
    cursor: pointer;
    padding: 3px 5px 3px 5px;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    color: #000000;
    text-decoration: none;
    &.mxDisabled {
      opacity: 0.2;
      cursor: default;
    }
    .geSprite {
      background: url('data:image/png;base64,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')
        no-repeat;
      _background: url('sprites.png') no-repeat top left;
      width: 21px;
      height: 21px;
      &.geSprite-formatpanel {
        background-position: 0 -3738px;
      }
      &.geSprite-delete {
        background-position: 0 -184px;
      }
      &.geSprite-toback {
        background-position: 0 -4014px;
      }
      &.geSprite-tofront {
        background-position: 0 -4060px;
      }
    }
  }
  .geSeparator {
    width: 1px;
    height: 20px;
    background: #e5e5e5;
    margin-left: 6px;
    margin-right: 6px;
    margin-top: 4px;
  }
  .geButton {
    width: 20px;
    height: 20px;
    padding: 0px 2px 4px 2px;
    margin: 2px;
    border: 1px solid transparent;
    cursor: pointer;
    opacity: 0.6;
    _filter: alpha(opacity=60);
    .geSprite {
      background: url('data:image/png;base64,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')
        no-repeat;
      _background: url('sprites.png') no-repeat top left;
      width: 21px;
      height: 21px;
      &.geSprite-formatpanel {
        background-position: 0 -3738px;
      }
      &.geSprite-middle {
        background-position: 0 -552px;
      }
      &.geSprite-print {
        background-position: 0 -598px;
      }
      &.geSprite-redo {
        background-position: 0 -644px;
      }
      &.geSprite-right {
        background-position: 0 -689px;
      }
      &.geSprite-shadow {
        background-position: 0 -735px;
      }
      &.geSprite-strokecolor {
        background-position: 0 -782px;
      }
      &.geSprite-top {
        background-position: 0 -828px;
      }
      &.geSprite-underline {
        background-position: 0 -874px;
      }
      &.geSprite-undo {
        background-position: 0 -920px;
      }
      &.geSprite-zoomin {
        background-position: 0 -966px;
      }
      &.geSprite-zoomout {
        background-position: 0 -1012px;
      }
      &.geSprite-arrow {
        background-position: 0 -1059px;
      }
      &.geSprite-linkedge {
        background-position: 0 -1105px;
      }
      &.geSprite-straight {
        background-position: 0 -1150px;
      }
      &.geSprite-entity {
        background-position: 0 -1196px;
      }
    }
  }
}
</style>