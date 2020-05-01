const { app } = require('electron')
const { create: createMainWindow } = require('./windows/main')
const { create: createControlWindow } = require('./windows/control')
const handleIPC = require('./ipc')

function createApp() {
  // 创建浏览器窗口
  createControlWindow()
  handleIPC()
}

app.whenReady()
  .then(createApp)
