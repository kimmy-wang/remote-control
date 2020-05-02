const { desktopCapturer, ipcRenderer } = require('electron')

async function getScreenStream() {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
  })
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sources[0].id,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height,
        }
      }
    })
      .then(stream => resolve(stream))
      .catch(err => reject(err))
  })
}

const pc = new window.RTCPeerConnection({})

async function createAnswer(offer) {
  let screenStream = await getScreenStream()

  pc.addStream(screenStream)
  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  console.log('answer', JSON.stringify(pc.localDescription))
  return pc.localDescription
}
window.createAnswer = createAnswer
