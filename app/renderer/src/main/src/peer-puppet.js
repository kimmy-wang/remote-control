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
pc.ondatachannel = function (e) {
  console.log('datachannel', e)
  e.channel.onmessage = function (e) {
    let { type, data } = JSON.parse(e.data)
    if (type === 'mouse') {
      data.screen = {
        width: window.screen.width,
        height: window.screen.height
      }
    }
    ipcRenderer.send('robot', type, data)
  }
}

// onicecandidate iceEvent
pc.onicecandidate = function (e) {
  console.log('candidate', JSON.stringify(e.candidate))
  if (e.candidate) {
    ipcRenderer.send('forward', 'puppet-candidate', e.candidate)
  }
}
ipcRenderer.on('candidate', (e, candidate) => {
  addIceCandidate(candidate)
})

// addIceCandidate
let candidates = []

async function addIceCandidate(candidate) {
  if (candidate) candidates.push(candidate)
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0, length = candidates.length; i < length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}

ipcRenderer.on('offer', async (e, offer) => {
  let answer = await createAnswer(offer)
  ipcRenderer.send('forward', 'answer', {
    type: answer.type,
    sdp: answer.sdp
  })
})

async function createAnswer(offer) {
  let screenStream = await getScreenStream()

  pc.addStream(screenStream)
  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  console.log('answer', JSON.stringify(pc.localDescription))
  return pc.localDescription
}
