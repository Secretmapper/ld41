import makeAnimations from '../helpers/animations'
import Atlas from '../objects/entities/Atlas'
import RTSGround from '../objects/entities/RTSGround'
let controls

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
        main: this.cameras.main,
        rts: this.cameras.add(0, 280, 800, 200).setName('rts'),
        rtsGui: this.cameras.add(0, 280, 800, 200)
      },
      gui: new GUI(this),
      entities: {
        ground: new RTSGround(this, 0, 0, 'entities', 'ground.png'),
        atlas: new Atlas(this, 400, 196, 'entities', 'atlas1.png')
      }
    }
    this.add.existing(this.state.entities.atlas)

    const { gui, cameras, entities } = this.state
    this.cameras.main.setZoom(0.5)

    cameras.main.ignore(gui.container)
    cameras.rtsGui.ignore(entities.ground)
    cameras.rtsGui.ignore(entities.ground.state.container)
    cameras.rtsGui.ignore(entities.atlas)

    cameras.rts.setZoom(2)
    cameras.main.startFollow(entities.atlas)

    this.input.setPollAlways()
    this.input.on('pointermove', this.onPointerMove, this)
  }

  update (time, delta) {
    super.update(...arguments)

    const { gui, cameras, entities } = this.state

    gui.update()
    entities.atlas.update()
    entities.ground.update()

    cameras.rts.setScroll(
      entities.ground.state.container.x - cameras.rts.width / 2,
      entities.ground.state.container.y + 4 - cameras.rts.height / 2,
    )
  }

  onPointerMove (pointer) {
    const { entities } = this.state

    if (pointer.y > 280) {
      entities.ground.state.building.x = (Phaser.Math.Clamp(pointer.x, 200, 600) - 400) / 2
    }
  }
}

export default GameScene
