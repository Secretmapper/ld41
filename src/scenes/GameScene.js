import makeAnimations from '../helpers/animations'
import Atlas from '../objects/entities/Atlas'
import RTSGround from '../objects/entities/RTSGround'
let controls

class GUI {
  constructor (scene) {
    this.scene = scene
    this.container = scene.add.container(0, 0)

    const food = this.addResource(0, 0, 'resources4.png')
    const people = this.addResource(0, 35, 'resources5.png')
    const wood = this.addResource(0, 70, 'resources1.png')
    const stone = this.addResource(0, 105, 'resources2.png')
    const prayer = this.addResource(0, 140, 'resources3.png')
  }

  addResource (x, y, key) {
    const icon = this.scene.add.sprite(x, y, 'entities', key)
    icon.depth = 20000
    icon.setOrigin(0, 0)

    const style = { font: '8px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 1, align: 'center' }
    const text = this.scene.add.text(x + icon.width + 10, y + icon.height / 2, '0', style)

    this.container.add(icon)
    this.container.add(text)

    return {
      icon,
      text
    }
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
    // cameras.main.startFollow(entities.atlas)

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
      const ROUND_VALUE = 25

      const coord = (Phaser.Math.Clamp(pointer.x, 200, 600)) / 2
      const round = Math.round(coord / ROUND_VALUE) * ROUND_VALUE
      entities.ground.state.building.x = round - 200
    }
  }
}

export default GameScene
