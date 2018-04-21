import makeAnimations from '../helpers/animations'
import Atlas from '../objects/entities/Atlas'
import RTSGround from '../objects/entities/RTSGround'
let controls

class GUI {
  constructor (scene) {
    // this.scene = scene
    // this.container = scene.add.container(0, 0)

    // this.resource = this.scene.add.sprite(0, 0, 'entities', 'resources1.png')
    // this.resource.depth = 20000
    // this.resource.setOrigin(0, 0)

    // const style = { font: '8px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 1, align: 'center' }
    // this.text = this.scene.add.text(this.resource.width, this.resource.height / 4, '100', style)

    // this.container.add(this.resource)
    // this.container.add(this.text)
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
        // rtsGui: this.cameras.add(0, 140, 400, 100)
      },
      gui: new GUI(this),
      entities: {
        ground: new RTSGround(this, 400, 100, 'entities', 'ground.png'),
        atlas: new Atlas(this, 400, 196, 'entities', 'atlas1.png')
      }
    }
    this.add.existing(this.state.entities.ground)
    this.add.existing(this.state.entities.atlas)

    const { gui, cameras, entities } = this.state
    this.cameras.main.setZoom(0.5)
    // cameras.main.setSize(0, 0, 400, 140)

    var cursors = this.input.keyboard.createCursorKeys();
    var camControl = (Phaser.Cameras.Controls.Smoothed) ? Phaser.Cameras.Controls.Smoothed : Phaser.Cameras.Controls.SmoothedKeyControl;
    controls = new camControl({
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    });

    cameras.main.setBackgroundColor('rgba(0,0,200,0.5)')
    cameras.rts.setBackgroundColor('rgba(0,0,200,0.5)')

    // this.cameras.main.ignore(gui.container)

    // cameras.rtsGui.ignore(entities.ground)
    // cameras.rtsGui.ignore(entities.ground.children)
    // cameras.rtsGui.ignore(entities.atlas)

    // cameras.rts.setZoom(2)
    // cameras.rts.setBackgroundColor(0x002244)
    // cameras.main.startFollow(entities.ground)
    cameras.rts.startFollow(entities.ground)

    this.input.setPollAlways()

    this.input.on('gameobjectover', function (pointer, gameObject) {
      gameObject.setTint(0xff0000)
    }, this)

    this.input.on('gameobjectout', function (pointer, gameObject) {
      gameObject.clearTint()
    }, this)

  }

  update (time, delta) {
    super.update(...arguments)
    controls.update(delta)

    const { gui, cameras, entities } = this.state

    // gui.update()
    entities.atlas.update()
    entities.ground.update()
  }
}

export default GameScene
