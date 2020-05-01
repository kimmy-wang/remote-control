const peer = require('./peer-control')

peer.on('add-stream', (stream) => {
  console.log('play stream')
  play(stream)
})

function play(stream) {
  const video = document.getElementById('video')
  video.srcObject = stream
  video.onloadedmetadata = function () {
    video.play()
  }
}
