import makeAnimations from '../helpers/animations'
import Atlas from '../objects/entities/Atlas'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.state = {}
  }

  create () {
    makeAnimations(this)

    this.state = {
      cameras: {
        rts: this.cameras.add(0, 140, 400, 100)
      },
      entities: {
        buildings: this.add.sprite(200, 50, 'entities', 'buildings.png'),
        atlas: new Atlas(this, 200, 98, 'entities', 'atlas1.png')
      }
    }
    this.add.existing(this.state.entities.atlas)

    const { cameras, entities } = this.state

    this.cameras.main.setZoom(0.5)
    cameras.rts.setZoom(2)
    cameras.rts.setBackgroundColor(0x002244)
    cameras.rts.startFollow(entities.buildings)
  }

  update () {
    const { cameras, entities } = this.state

    entities.buildings.y = entities.atlas.y - 48
  }
}

export default GameScene
