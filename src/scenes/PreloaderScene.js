import WebFont from 'webfontloader'

class PreloaderScene extends Phaser.Scene {
  constructor () {
    super({ key: 'PreloaderScene' })

    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    this.load.atlas('entities', 'assets/textures/entities.png', 'assets/textures/entities.json')

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
      this.scene.start('GameScene')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}

export default PreloaderScene
