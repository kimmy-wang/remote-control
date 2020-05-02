const { app } = require('electron')
const { create: createMainWindow, show: showMainWindow, close: closeMainWindow } = require('./windows/main')
const { create: createControlWindow } = require('./windows/control')
const handleIPC = require('./ipc')
const getInLock = app.releaseSingleInstanceLock()
if (getInLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    showMainWindow()
  })

  function createApp() {
    // 创建浏览器窗口
    createMainWindow()
    handleIPC()
    require('./trayAndMenu')
    require('./robot')()
  }

  app.whenReady()
    .then(createApp)

  app.on('before-quit', () => {
    closeMainWindow()
  })

  app.on('activate', () => {
    showMainWindow()
  })
}

