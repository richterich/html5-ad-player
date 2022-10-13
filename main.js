import './style.css'
import PlayerOverlay from './PlayerOverlay'

let playing = false
let timestamp = 0

window.addEventListener('DOMContentLoaded', (_) => {

    const playerOverlay = new PlayerOverlay()
    playerOverlay.initialize()

    setInterval(() => {
        if (playing && 1 > timestamp) timestamp += 0.05
        else if (1 <= timestamp) timestamp = 0
        playerOverlay.updateProgress(timestamp)
    }, 500)

    setTimeout(() => {
        if (playerOverlay.notActivated) playerOverlay.showOverlay()
        if (playerOverlay.notSpinnig) playerOverlay.showSpinner()
    }, 1500)

    const spinnerTimeout = setTimeout(() => {
        playing = true
        if (playerOverlay.spinning) playerOverlay.hideSpinner()
    }, 3000)

    playerOverlay.overlay.addEventListener('click', (event) => {
        event.stopPropagation()
        playing = false

        if (spinnerTimeout) clearTimeout(spinnerTimeout)
        if (playerOverlay.spinning) playerOverlay.hideSpinner()

        if (playerOverlay.notPaused) playerOverlay.showPause()

        console.log('pause ad clicked')
    })

    playerOverlay.pause.addEventListener('click', (event) => {
        event.stopPropagation()
        playing = true

        if (playerOverlay.paused) playerOverlay.hidePause()

        console.log('resume ad clicked')
    })
})
