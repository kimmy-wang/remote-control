const { ipcMain } = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')

function handleMouse(data) {
  // data {clientX, clientY, screen: {width, height}, video: {width, height}}
  const { clientX, clientY, screen: { width: screenWidth, height: screenHeight }, video: { width, height } } = data
  let x = clientX * screenWidth / width
  let y = clientY * screenHeight / height
  robot.moveMouse(x, y)
  robot.mouseClick()
}

function handleKey(data) {
  // data {keyCode, meta, alt, ctrl, shift}
  const modifiers = []
  if (data.meta) modifiers.push('meta')
  if (data.alt) modifiers.push('alt')
  if (data.ctrl) modifiers.push('ctrl')
  if (data.shift) modifiers.push('shift')
  let key = vkey[data.keyCode].toLowerCase()
  if (key[0] !== '<') {
    robot.keyTap(key, modifiers)
  }
}

module.exports = function () {
  ipcMain.on('robot', (e, type, data) => {
    if (type === 'mouse') {
      handleMouse(data)
    } else if (type === 'key') {
      handleKey(data)
    }
  })
}
