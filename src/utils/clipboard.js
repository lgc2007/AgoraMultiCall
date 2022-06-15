/*
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2021-12-06 16:20:12
 * @LastEditors: lgc
 * @LastEditTime: 2021-12-24 16:09:05
 */
import Vue from 'vue';
import Clipboard from 'clipboard';

function clipboardSuccess() {
  Vue.prototype.$message({
    message: 'Copy successfully',
    type: 'success',
    duration: 1500
  });
}

function clipboardError() {
  Vue.prototype.$message({
    message: 'Copy failed',
    type: 'error'
  });
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  });
  clipboard.on('success', () => {
    clipboardSuccess();
    clipboard.destroy();
  });
  clipboard.on('error', () => {
    clipboardError();
    clipboard.destroy();
  });
  clipboard.onClick(event);
}
