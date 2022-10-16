import './style.css'
import AdvertisingPlayer from './src/AdvertisingPlayer'

const advertisingPlayer = new AdvertisingPlayer()

window.addEventListener('DOMContentLoaded', _ => {
  advertisingPlayer.initializePlayerOverlay()
  advertisingPlayer.initializeAdOverlay()

  setTimeout(_ => {
    advertisingPlayer.tryRequest()
  }, 3000)

  setTimeout(_ => {
    advertisingPlayer.loadAds()
  }, 4000)
})
