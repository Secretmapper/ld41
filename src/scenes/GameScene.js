import makeAnimations from '../helpers/animations'
import Atlas from '../objects/entities/Atlas'
import RTSGround from '../objects/entities/RTSGround'

class GUI {
  constructor (scene) {
    this.scene = scene
    this.container = scene.add.container(0, 0)

    this.resource = this.scene.add.sprite(0, 0, 'entities', 'resources1.png')
    this.resource.depth = 20000
    this.resource.setOrigin(0, 0)

    const style = { font: '8px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 1, align: 'center' }
    this.text = this.scene.add.text(this.resource.width, this.resource.height / 4, '100', style)

    this.container.add(this.resource)
    this.container.add(this.text)
    // this.resource.setScrollFactor(0)
  }

  update () {
    const { cameras, entities } = this.scene.state
  }
}

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.state = {}
  }

  create () {
    makeAnimations(this)

    this.state = {
      cameras: {
        rts: this.cameras.add(0, 140, 400, 100),
        rtsGui: this.cameras.add(0, 140, 400, 100)
      },
      gui: new GUI(this),
      entities: {
        ground: new RTSGround(this, 200, 50, 'entities', 'ground.png'),
        atlas: new Atlas(this, 200, 98, 'entities', 'atlas1.png')
      }
    }
    this.add.existing(this.state.entities.ground)
    this.add.existing(this.state.entities.atlas)

    const { gui, cameras, entities } = this.state

    this.cameras.main.setZoom(0.5)
    this.cameras.main.ignore(gui.container)

    cameras.rtsGui.ignore(entities.ground)
    cameras.rtsGui.ignore(entities.ground.state.building)
    cameras.rtsGui.ignore(entities.ground.state.person)
    cameras.rtsGui.ignore(entities.atlas)

    cameras.rts.setZoom(2)
    cameras.rts.setBackgroundColor(0x002244)
    cameras.rts.startFollow(entities.ground)
  }

  update () {
    const { gui, cameras, entities } = this.state

    // gui.update()
    entities.atlas.update()
    entities.ground.update()
  }
}

export default GameScene
