const { BrowserWindow } = require('electron')
const path = require('path')

let win
function create() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载index.html文件
  win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))

  // 打开开发者工具
  win.webContents.openDevTools()
  return win
}

module.exports = {create}
