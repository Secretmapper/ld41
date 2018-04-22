import makeAnimations from '../helpers/animations'
import LevelMap from '../managers/LevelMap'
import Atlas from '../objects/entities/Atlas'
import RTSGround from '../objects/entities/RTSGround'

import ld from 'lodash'
import fp from 'lodash/fp'

class GUI {
  constructor (scene) {
    this.scene = scene
    this.container = scene.add.container(0, 0)

    const gold = this.addResource(10, 0, 'resources6.png')
    const food = this.addResource(10, 35, 'resources4.png')
    const wood = this.addResource(10, 70, 'resources1.png')
    const stone = this.addResource(10, 105, 'resources2.png')
    const prayer = this.addResource(10, 140, 'resources3.png')

    for (let i = 2; i < 9; i++) {
      const z = i - 2
      const sprite = (
        this.scene.add.sprite(
          680 + 40 * Math.floor(z / 3),
          40 + z * 40 - Math.floor(z / 3) * 120,
          'entities',
          `structures${i}.png`
        )
      )
      sprite.setInteractive()
      this.container.add(sprite)
    }

    this.guis = {
      gold, food, wood, stone, prayer
    }

    this.updateResourceText = this._updateResourceText.bind(this)
  }

  addResource (x, y, key) {
    const icon = this.scene.add.sprite(x, y, 'entities', key)
    icon.depth = 20000
    icon.setOrigin(0, 0)

    const style = { font: '12px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 1, align: 'center' }
    const text = this.scene.add.text(x + icon.width + 10, y + icon.height / 3, '0', style)

    this.container.add(icon)
    this.container.add(text)

    return {
      icon,
      text
    }
  }

  update () {
    const { cameras, entities } = this.scene.state

    const resources = this.scene.data.get('resources')
    ld.forEach(resources, this.updateResourceText)
  }

  _updateResourceText (resource, key) {
    this.guis[key].text.setText(resource)
  }
}

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.state = {}
  }

  create () {
    makeAnimations(this)

    this.data.set('resources', {
      gold: 300,
      food: 20,
      wood: 40,
      stone: 30,
      prayer: 0
    })

    this.data.set('depths', {
      gui: 30000
    })

    new LevelMap(this)

    this.state = {
      cameras: {
        main: this.cameras.main,
        rts: this.cameras.add(0, 0, 800, 200).setName('rts'),
        rtsGui: this.cameras.add(0, 0, 800, 200)
      },
      gui: new GUI(this),
      entities: {
        ground: new RTSGround(this, 0, 0, 'entities', 'ground.png'),
        atlas: new Atlas(this, 400, 196, 'entities', 'atlas1.png')
      }
    }

    this.add.existing(this.state.entities.atlas)

    const { gui, cameras, entities } = this.state
    cameras.main.setZoom(0.5)
    cameras.main.setSize(800, 280)
    cameras.main.setPosition(0, 200)

    cameras.main.ignore(gui.container)
    cameras.rts.ignore(gui.container)
    cameras.rtsGui.ignore(entities.ground)
    cameras.rtsGui.ignore(entities.ground.state.container)
    cameras.rtsGui.ignore(entities.atlas)

    cameras.rts.setZoom(2)

    this.input.setPollAlways()
    this.input.on('pointermove', this.onPointerMove, this)
    this.input.on('pointerup', this.onPointerUp, this)

    this.input.on('gameobjectover', function (pointer, obj) {
      obj.setTint(0x00ff00)
    })
    this.input.on('gameobjectup', function (pointer, obj) {
      entities.ground.state.building.setFrame(obj.frame.name)
    })
    this.input.on('gameobjectout', function (pointer, obj) {
      obj.clearTint()
    })

    this.physics.add.collider(entities.atlas, this.map.tiles.bg)
  }

  update (time, delta) {
    super.update(...arguments)

    const { gui, cameras, entities } = this.state

    gui.update()
    entities.atlas.update()
    entities.ground.update()

    cameras.main.setScroll(
      (entities.atlas.x - cameras.main.width / 2),
      (entities.atlas.y - cameras.main.height)
    )

    cameras.rts.setScroll(
      entities.ground.state.container.x - cameras.rts.width / 2,
      entities.ground.state.container.y + 4 - cameras.rts.height / 2,
    )
  }

  onPointerMove (pointer) {
    const { entities } = this.state
    const building = entities.ground.state.building

    if (pointer.y < 200) {
      const ROUND_VALUE = 25

      const coord = (Phaser.Math.Clamp(pointer.x, 200, 600)) / 2
      const round = Math.round(coord / ROUND_VALUE) * ROUND_VALUE

      building.x = round - 200
      building.visible = (pointer.x > 200 && pointer.x < 600)
    }
  }

  onPointerUp (pointer) {
    const { entities } = this.state

    if (
      pointer.y < 200 && (pointer.x > 200 && pointer.x < 600)
    ) {
      
      const ROUND_VALUE = 25

      const coord = (Phaser.Math.Clamp(pointer.x, 200, 600)) / 2
      const round = Math.round(coord / ROUND_VALUE) * ROUND_VALUE

      entities.ground.spawnBuilding(round)
    }
  }
}

export default GameScene
