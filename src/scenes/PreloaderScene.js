import WebFont from 'webfontloader'
import makeAnimations from '../helpers/animations'

class PreloaderScene extends Phaser.Scene {
  constructor () {
    super({ key: 'PreloaderScene' })

    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    this.load.atlas('entities', 'assets/textures/entities.png', 'assets/textures/entities.json')

    this.load.audio('melody', ['assets/audio/melody.ogg', 'assets/audio/melody.mp3'])
    this.load.audio('town', ['assets/audio/town.ogg', 'assets/audio/town.mp3'])

    this.load.audio('sfx_arrows', ['assets/audio/sfx_arrows.ogg', 'assets/audio/sfx_arrows.mp3'])
    this.load.audio('sfx_hurt', ['assets/audio/sfx_hurt.ogg', 'assets/audio/sfx_hurt.mp3'])
    this.load.audio('sfx_jump', ['assets/audio/sfx_jump.ogg', 'assets/audio/sfx_jump.mp3'])

    this.load.tilemapTiledJSON('map', 'assets/tiles/map.json')
    this.load.image('tiles', 'assets/textures/tiles.png')

    WebFont.load({
      custom: {
        families: ['press_start'],
        urls: ['/assets/fonts/press_start.css']
      },
      active: this.fontsLoaded
    })
  }

  update () {
    if (this.fontsReady) {
      makeAnimations(this)
      this.scene.start('SplashScene')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}

export default PreloaderScene
