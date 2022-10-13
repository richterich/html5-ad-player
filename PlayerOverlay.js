export default class PlayerOverlay {
    constructor() {
        this.overlayClassList = ['player-overlay', 'hidden-box', 'fixed-box']
        this.playerHTML = `
            <div class="player-ui">
                <div class="player-progress">
                    <div class="progress-bar" style="width: 0%;"></div>
                </div>
                <video id="video-player" class="video-player" playsinline="playsinline" muted="muted"></video>
                <div id="video-ad-overlay" class="video-ad-overlay"></div>
            </div>
            <div class="player-spinner">
                <svg class="spinner-circle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle class="svg-circle" cx="50" cy="50" r="45"/>
                </svg>
            </div>
            <div class="player-pause hidden-box">
                <div class="pause-bg"></div>
            </div>
        `
        this.overlay = undefined
        this.progress = undefined
        this.spinner = undefined
        this.pause = undefined
    }

    get activated() {
        return null !== document.querySelector('.player-overlay.visible-box')
    }

    get notActivated() {
        return null !== document.querySelector('.player-overlay.hidden-box')
    }

    get paused() {
        return null !== document.querySelector('.player-pause.visible-box')
    }

    get notPaused() {
        return null !== document.querySelector('.player-pause.hidden-box')
    }

    get spinning() {
        return null === document.querySelector('.player-spinner.hidden-box')
    }

    get notSpinnig() {
        return null !== document.querySelector('.player-spinner.hidden-box')
    }

    initialize() {
        this.overlay = document.createElement('div')
        this.overlay.classList.add(...this.overlayClassList)
        this.overlay.innerHTML = this.playerHTML
        document.body.appendChild(this.overlay)
        //
        this.progress = document.querySelector('.progress-bar')
        this.spinner = document.querySelector('.player-spinner')
        this.pause = document.querySelector('.player-pause')
    }

    showOverlay() {
        this.overlay.classList.add('visible-box')
        this.overlay.classList.remove('hidden-box')
    }

    hideOverlay() {
        this.overlay.classList.add('hidden-box')
        this.overlay.classList.remove('visible-box')
    }

    showSpinner() {
        this.spinner.classList.add('visible-box')
        this.spinner.classList.remove('hidden-box')
    }

    hideSpinner() {
        this.spinner.classList.add('hidden-box')
        this.spinner.classList.remove('visible-box')
    }

    showPause() {
        this.pause.classList.add('visible-box')
        this.pause.classList.remove('hidden-box')
    }

    hidePause() {
        this.pause.classList.add('hidden-box')
        this.pause.classList.remove('visible-box')
    }

    updateProgress(value) {
        this.progress.style.width = `${value * 100}%`
    }
}
