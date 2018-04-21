import makeAnimations from '../helpers/animations'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  create () {
    makeAnimations(this)

    this.add.sprite(200, 50, 'entities', 'buildings.png')

    const atlas = this.add.sprite(200, 98, 'entities', 'atlas1.png')
    atlas.anims.play('atlas/idle')
  }
}

export default GameScene
