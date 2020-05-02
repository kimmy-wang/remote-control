import React, {useState, useEffect} from 'react';
import './App.css';
import {ipcRenderer} from 'electron';
import './peer-puppet';
// const {ipcRenderer} = window.require('electron')

function App() {
  const [remoteCode, setRemoteCode] = useState('')
  const [localCode, setLocalCode] = useState('')
  const [controlText, setControlText] = useState('')
  const login = async () => {
    const code = await ipcRenderer.invoke('login')
    setLocalCode(code)
  }
  useEffect(() => {
    login()
    ipcRenderer.on('control-state-change', handleControlState)
    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlState)
    }
  }, [])

  const startControl = (code) => {
    ipcRenderer.send('control', code)
  }

  const handleControlState = (e, name, type) => {
    let text = ''
    if (type === 1) {
      text = `正在远程控制${name}`
    } else if (type === 2) {
      text = `正在被${name}远程控制中`
    }
    setControlText(text)
  }
  return (
    <div className="App">
      {
        controlText === '' ? <>
          <div>你的控制码是{localCode}</div>
          <input type='text' value={remoteCode} onChange={event => setRemoteCode(event.target.value)}/>
          <button onClick={event => startControl(remoteCode)}>连 接</button>
        </> : <div>{controlText}</div>
      }
    </div>
  );
}

export default App;
