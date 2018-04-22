import makeAnimations from '../helpers/animations'
import LevelMap from '../managers/LevelMap'
import Atlas from '../objects/entities/Atlas'
import RTSGround from '../objects/entities/RTSGround'
import Wood from '../objects/entities/Wood'

import ld from 'lodash'
import fp from 'lodash/fp'

const style = { font: '12px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 6, align: 'center' }
const rightStyle = { font: '12px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 6, align: 'left' }

class GUI {
  constructor (scene) {
    this.scene = scene
    this.container = scene.add.container(0, 0)
    this._buildings = scene.add.container(0, 0)
    this._actions = scene.add.container(0, 0)

    this._buildings.visible = false
    this._actions.visible = false
    this._buildings.setScale(0)
    this._actions.setScale(0)

    this.instructionText = this.scene.add.text(0, 0, ['House', 'provides gold'], rightStyle)
    this.instructionText.alpha = 0
    this.instructionText.setOrigin(1, 0)

    const gold = this.addResource(10, 0, 'resources6.png')
    const food = this.addResource(10, 35, 'resources4.png')
    const wood = this.addResource(10, 70, 'resources1.png')
    const stone = this.addResource(10, 105, 'resources2.png')
    const prayer = this.addResource(10, 140, 'resources3.png')

    this.buildingsButton = 
      this.scene.add.sprite(
        680,
        20,
        'entities',
        `structures12.png`
      )
    this.buildingsButton.isBuildings = true

    this.faithButton = 
      this.scene.add.sprite(
        720,
        20,
        'entities',
        `structures13.png`
      )
    this.faithButton.isFaith = true

    this.container.add(this.buildingsButton)
    this.container.add(this.faithButton)
    this.buildingsButton.setInteractive()
    this.faithButton.setInteractive()

    let Is = [
      2, 3, 4, 5, 6, 7, 8, 9, 10
    ]
    for (let Is_i = 0; Is_i < Is.length; Is_i++) {
      const i = Is[Is_i]
      const z = Is_i
      const sprite = (
        this.scene.add.sprite(
          680 + 40 * Math.floor(z / 3),
          60 + z * 50 - Math.floor(z / 3) * 150,
          'entities',
          `structures${i}.png`
        )
      )
      sprite.setInteractive()
      this._buildings.add(sprite)
    }

    Is = [
      14
    ]
    for (let Is_i = 0; Is_i < Is.length; Is_i++) {
      const i = Is[Is_i]
      const z = Is_i
      const sprite = (
        this.scene.add.sprite(
          680 + 40 * Math.floor(z / 3),
          60 + z * 50 - Math.floor(z / 3) * 150,
          'entities',
          `structures${i}.png`
        )
      )
      sprite.setInteractive()
      this._actions.add(sprite)
    }

    this.container.add(this._buildings)
    this.container.add(this._actions)

    this.guis = {
      gold, food, wood, stone, prayer
    }

    this.updateResourceText = this._updateResourceText.bind(this)
  }

  showBuildings () {
    this._buildings.visible = true
    this._buildings.setScale(1, 1)

    this._actions.visible = false
    this._actions.setScale(0)
  }

  showActions () {
    this._buildings.visible = false
    this._buildings.setScale(0)

    this._actions.visible = true
    this._actions.setScale(1, 1)
  }

  addResource (x, y, key) {
    const icon = this.scene.add.sprite(x, y, 'entities', key)
    icon.depth = 20000
    icon.setOrigin(0, 0)

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
        atlas: new Atlas(this, 400, 196, 'entities', 'atlas1.png'),
        dynamic: this.physics.add.group({ runChildUpdate: true })
      }
    }

    this.add.existing(this.state.entities.atlas)

    const { gui, cameras, entities } = this.state
    cameras.main.setZoom(0.5)
    // cameras.main.setBounds(0, 0, this.map.map.widthInPixels, this.map.map.heightInPixels)

    cameras.main.setSize(800, 280)
    cameras.main.setPosition(0, 200)

    const statue = this.add.sprite(800, 365, 'entities', 'statues1.png')

    const ghost = this.add.sprite(200, 200, 'entities', 'ghost1.png')
    ghost.anims.play('ghost/idle')
    ghost.flipX = true

    cameras.main.ignore(gui.container)
    cameras.main.ignore(gui.instructionText)
    cameras.rts.ignore(gui.container)
    cameras.rts.ignore(gui.instructionText)
    cameras.rtsGui.ignore(ghost)
    cameras.rtsGui.ignore(entities.ground)
    cameras.rtsGui.ignore(entities.ground.state.container)
    cameras.rtsGui.ignore(entities.atlas)

    cameras.rts.setZoom(2)

    this.input.setPollAlways()
    this.input.on('pointermove', this.onPointerMove, this)
    this.input.on('pointerup', this.onPointerUp, this)

    this.input.on('gameobjectup', function (pointer, obj) {
      if (obj.isFaith) {
        return gui.showActions()
      }
      else if (obj.isBuildings) {
        return gui.showBuildings()
      }
      switch(obj.frame.name) {
        case 'structures14.png':
          const wood = new Wood(this.scene, entities.atlas.x, entities.atlas.y - entities.atlas.height / 2)
          entities.dynamic.add(wood)
          this.scene.add.existing(wood)
          wood.body.setVelocity(entities.atlas.flipX ? -100 : 100, 0)
          return
      }

      entities.ground.state.building.setFrame(obj.frame.name)
    })
    this.input.on('gameobjectover', function (pointer, obj) {
      obj.setTint(0x00ff00)

      switch (obj.frame.name) {
        case 'structures2.png':
          gui.instructionText.setText(['House', 'produces gold'])
          break
        case 'structures3.png':
          gui.instructionText.setText(['Woodcutter', 'produces wood'])
          break
        case 'structures4.png':
          gui.instructionText.setText(['Watchtower', 'shoots arrows'])
          break
        case 'structures5.png':
          gui.instructionText.setText(['Mage', 'shoots magic fireballs'])
          break
        case 'structures6.png':
          gui.instructionText.setText(['Temple', 'produces faith'])
          break
        case 'structures7.png':
          gui.instructionText.setText(['Windmill', 'increases Atlas\' speed'])
          break
        case 'structures8.png':
          gui.instructionText.setText(['Farm', 'provides food'])
          break
        case 'structures9.png':
          gui.instructionText.setText(['Goldmine', 'produces lots of gold'])
          break
        case 'structures10.png':
          gui.instructionText.setText(['Catapult', 'shoots Boulders'])
          break
        case 'structures11.png':
          gui.instructionText.setText('townhall')
          break
        case 'structures12.png':
          gui.instructionText.setText(['Buildings'])
          break
        case 'structures13.png':
          gui.instructionText.setText(['Actions'])
          break
        case 'structures14.png':
          gui.instructionText.setText(['Create Steppable Wood Platform'])
          break
      }
      gui.instructionText.x = obj.x
      gui.instructionText.y = obj.y
      gui.instructionText.alpha = 1
    })
    this.input.on('gameobjectout', function (pointer, obj) {
      obj.clearTint()
      gui.instructionText.alpha = 0
    })
    // cameras.main.startFollow(entities.atlas)

    this.physics.add.collider(entities.atlas, this.map.tiles.bg)
    this.physics.add.collider(entities.atlas, entities.dynamic)
    this.physics.add.collider(entities.dynamic, this.map.tiles.bg)
    this.physics.add.collider(entities.dynamic, entities.dynamic)
  }

  update (time, delta) {
    super.update(...arguments)

    const { gui, cameras, entities } = this.state

    gui.update()
    entities.atlas.update()
    entities.ground.update()

    cameras.main.setScroll(
      Math.max(
        400,
        (entities.atlas.x - cameras.main.width / 2)
      ),
      (entities.atlas.y - cameras.main.height * 3 / 4)
    )

    cameras.rts.setScroll(
      entities.ground.state.container.x - cameras.rts.width / 2,
      entities.ground.state.container.y + 4 - cameras.rts.height / 2,
    )
  }

  onPointerMove (pointer) {
    const { entities } = this.state
    const building = entities.ground.state.building

    building.visible = (pointer.y < 200 && pointer.x > 160 && pointer.x < 640)

    if (pointer.y < 200) {
      const ROUND_VALUE = 25

      const coord = (Phaser.Math.Clamp(pointer.x, 180, 600)) / 2
      const round = Math.round(coord / ROUND_VALUE) * ROUND_VALUE

      building.x = round - 200
    }
  }

  onPointerUp (pointer) {
    const { entities } = this.state

    if (
      pointer.y < 200 && (pointer.x > 160 && pointer.x < 640)
    ) {
      
      const ROUND_VALUE = 25

      const coord = (Phaser.Math.Clamp(pointer.x, 200, 600)) / 2
      const round = Math.round(coord / ROUND_VALUE) * ROUND_VALUE

      entities.ground.spawnBuilding(round)
    }
  }
}

export default GameScene
