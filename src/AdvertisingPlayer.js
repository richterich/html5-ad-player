import loadSdkScript from './SdkLoader'
import PlayerOverlay from './PlayerOverlay'

export default class AdvertisingPlayer {
  constructor () {
    this.playerOverlay = new PlayerOverlay()
    this.countdownTimer = undefined
    this.videoPlayer = undefined
    this.adOverlay = undefined
    this._loaded = false
    this.display = undefined
    this.loader = undefined
    this.manager = undefined
    this.ima = undefined
  }

  playerOverlay
  countdownTimer
  videoPlayer
  _loaded
  adOverlay
  display
  loader
  manager
  ima

  initializePlayerOverlay () {
    this.playerOverlay.initialize()
    this.videoPlayer = document.getElementById('video-player')
    this.adOverlay = document.getElementById('video-ad-overlay')
    this.playerOverlay.pause.addEventListener('click', () => {
      if (this.playerOverlay.paused) this.playerOverlay.hidePause()
      if (this.manager) this.manager.resume()
    })
  }

  initializeAdOverlay () {
    loadSdkScript('https://imasdk.googleapis.com/js/sdkloader/ima3.js')
      .then(google => {
        console.debug('Advertising SDK %s is loaded', google.ima.VERSION, google.ima)
        this.ima = google.ima
        this.display = new this.ima.AdDisplayContainer(this.adOverlay, this.videoPlayer)
        this.loader = new this.ima.AdsLoader(this.display)
        // Subscribe on ads loader's events
        this.loader.addEventListener(
          this.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
          loadedEvent => {
            console.log('Ads Manager is loaded', loadedEvent)
            this.manager = loadedEvent.getAdsManager(this.videoPlayer)
            // Subscribe on ads manager's events
            this.manager.addEventListener(
              this.ima.AdErrorEvent.Type.AD_ERROR,
              error => {
                console.error(error.getError(), error)
                if (this.manager) this.manager.destroy()
              })
            this.manager.addEventListener(
              this.ima.AdEvent.Type.STARTED,
              () => {
                this.countdownTimer = setInterval(() => {
                  let timeRemaining = this.manager.getRemainingTime()
                  timeRemaining = 1.08 - timeRemaining / 10
                  this.playerOverlay.updateProgress(timeRemaining)
                }, 500)
              })
            this.manager.addEventListener(
              this.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
              () => {
                if (this.playerOverlay.spinning) this.playerOverlay.hideSpinner()
              })
            this.manager.addEventListener(
              this.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
              () => {
                clearInterval(this.countdownTimer)
                if (this.playerOverlay.activated) this.playerOverlay.hideOverlay()
              })
            this.manager.addEventListener(
              this.ima.AdEvent.Type.PAUSED,
              () => {
                if (this.playerOverlay.notPaused) this.playerOverlay.showPause()
              })
          },
          false
        )
        this.loader.addEventListener(
          this.ima.AdErrorEvent.Type.AD_ERROR,
          error => {
            console.error(error.getError(), error)
            if (this.manager) this.manager.destroy()
          },
          false
        )
      }).catch(error => {
        console.error('Advertisement SDK could not be loaded', error)
        if (this.playerOverlay.activated) this.playerOverlay.hideOverlay()
      })
    if (this.playerOverlay.notActivated) this.playerOverlay.showOverlay()
    if (this.playerOverlay.notSpinnig) this.playerOverlay.showSpinner()
  }

  tryRequest () {
    const request = new this.ima.AdsRequest()
    request.adTagUrl =
      'https://pubads.g.doubleclick.net/gampad/ads?' +
      'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
      'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
      'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator='
    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    request.linearAdSlotWidth = this.videoPlayer.clientWidth
    request.linearAdSlotHeight = this.videoPlayer.clientHeight
    request.nonLinearAdSlotWidth = this.videoPlayer.clientWidth
    request.nonLinearAdSlotHeight = this.videoPlayer.clientHeight / 3
    // Pass the request to the adsLoader to request ads
    this.loader.requestAds(request)
  }

  loadAds () {
    // Prevent this function from running on if there are already ads loaded
    if (this._loaded) return
    this._loaded = true
    console.log('loading ads')
    // Initialize the container. Must be done via a user action on mobile devices.
    this.display.initialize()
    const { clientWidth, clientHeight } = this.videoPlayer
    try {
      this.manager.init(clientWidth, clientHeight, this.ima.ViewMode.NORMAL)
      this.manager.start()
    } catch (error) {
      // Play the video without ads, if an error occurs
      console.error('AdsManager could not be started', error)
    }
  }
}
