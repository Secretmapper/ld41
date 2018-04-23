import Clouds from '../managers/Clouds'
import LevelMap from '../managers/LevelMap'
import Enemies from '../managers/Enemies'
import Shooting from '../managers/Shooting'
import Atlas from '../objects/entities/Atlas'
import RTSGround from '../objects/entities/RTSGround'
import Wood from '../objects/entities/Wood'
import Chaser from '../objects/entities/Chaser'
import Ghost from '../objects/entities/Ghost'

import ld from 'lodash'
import fp from 'lodash/fp'

const style = { font: '12px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 6, align: 'center' }
const rightStyle = { font: '12px press_start', fill: '#ffffff', stroke: 'black', strokeThickness: 6, align: 'left' }

const styles = {
  instruction: {
    font: '24px press_start',
    fill: '#ffffff',
    stroke: 'black',
    strokeThickness: 6,
    align: 'left',
    wordWrap: {
      width: 800
    }
  }
}

const frameData = {
  'structures2.png': {
    detail: ['House', 'produces gold'],
    cost: { gold: 100, food: 800 },
    makes: { gold: 10 }
  },
  'structures3.png': {
    detail: ['Woodcutter', 'produces wood'],
    cost: { gold: 100, food: 400 },
    makes: { wood: 5 }
  },
  'structures4.png': {
    detail: ['Watchtower', 'shoots arrows against enemies'],
    cost: { gold: 600, wood: 100 }
  },
  'structures5.png': {
    detail: ['Mage', 'shoots magic fireballs'],
    cost: { gold: 1000, wood: 500 }
  },
  'structures6.png': {
    detail: ['Temple', 'produces faith'],
    cost: { gold: 800, food: 800 },
    makes: { faith: 1 }
  },
  'structures7.png': {
    detail: ['Windmill', 'increases Atlas\' speed'],
    cost: { gold: 100, food: 400 }
  },
  'structures8.png': {
    detail: ['Farm', 'provides food'],
    cost: { gold: 100 },
    makes: { food: 10 }
  },
  'structures9.png': {
    detail: ['Goldmine', 'produces lots of gold'],
    cost: { gold: 100, food: 400 },
    makes: { gold: 50 }
  },
  'structures10.png': {
    detail: ['Catapult', 'shoots Boulders'],
    cost: { gold: 100, food: 400 }
  },
  'structures11.png': {
    detail: ['townhall'],
    cost: { gold: 100, food: 400 }
  },
  'structures12.png': {
    detail: ['Buildings']
  },
  'structures13.png': {
    detail: ['Actions']
  },
  'structures14.png': {
    detail: ['Create Steppable Wood Platform'],
    cost: { gold: 100, wood: 80 }
  },
  'structures15.png': {
    detail: ['Destroy']
  },
}

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

    this.messageText = this.scene.add.text(0, 0, [], styles.instruction)

    this.instructionText = this.scene.add.text(0, 0, ['House', 'provides gold'], rightStyle)
    this.instructionText.alpha = 0
    this.instructionText.setOrigin(1, 0.5)

    this.costText = this.scene.add.text(0, 0, ['Costs:'], rightStyle)
    this.costText.alpha = 0
    this.costText.setOrigin(1, 1)

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

    this.sellButton = 
      this.scene.add.sprite(
        760,
        20,
        'entities',
        `structures15.png`
      )
    this.sellButton.isSell = true

    this.container.add(this.buildingsButton)
    this.container.add(this.faithButton)
    this.container.add(this.sellButton)
    this.buildingsButton.setInteractive()
    this.faithButton.setInteractive()
    this.sellButton.setInteractive()

    let Is = [
      8, 3, 2, 4, 5, 6, 7, 9
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
      sprite.depth = 3000000
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

  showSale () {
    this._buildings.visible = false
    this._buildings.setScale(0)

    this._actions.visible = false
    this._actions.setScale(0)
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
    if (this.scene.state.DEAD) return

    const { cameras, entities } = this.scene.state

    const resources = this.scene.data.get('resources')
    ld.forEach(resources, this.updateResourceText)

    entities.atlas.SHOT_TIMER_MAX = 60
  }

  _updateResourceText (resource, key) {
    this.guis[key].text.setText(resource)
  }
}

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  create () {
    const melody = this.sound.add('melody', { loop: true })
    melody.play()
    this._melody = melody

    this._audio = {
      sfx: {
        hurt: this.sound.add('sfx_hurt')
      }
    }

    this.state = {}
    this.depths = {
      bullets: 300000,
      messages: 400000
    }

    this.data.set('resources', {
      gold: 100,
      food: 0,
      wood: 0,
      stone: 0,
      prayer: 0
    })

    this.data.set('depths', {
      gui: 30000
    })

    new LevelMap(this)
    new Shooting(this)
    new Enemies(this)
    this.clouds = new Clouds(this)

    this.state = {
      DEAD: false,
      cameras: {
        main: this.cameras.main,
        rts: this.cameras.add(0, 0, 800, 200).setName('rts'),
        rtsGui: this.cameras.add(0, 0, 800, 200)
      },
      gui: new GUI(this),
      entities: {
        ground: new RTSGround(this, 0, 0, 'entities', 'ground.png'),
        atlas: new Atlas(this, 180, 360, 'entities', 'atlas1.png'),
        dynamic: this.physics.add.group({ runChildUpdate: true }),
        statues: this.physics.add.group({ runChildUpdate: true }),
        enemies: this.enemies.group,
        zones: this.physics.add.group()
      },
      doneScripts: {
        spawnGhosts: false,
        spawnGhostsTimer: 0
      }
    }

    this.add.existing(this.state.entities.atlas)

    const { gui, cameras, entities } = this.state
    cameras.main.setZoom(0.5)
    // cameras.main.setBounds(0, 0, this.map.map.widthInPixels, this.map.map.heightInPixels)

    cameras.main.setSize(800, 280)
    cameras.main.setPosition(0, 200)

    cameras.main.ignore(gui.container)
    cameras.main.ignore(gui.instructionText)
    cameras.main.ignore(gui.costText)
    cameras.rtsGui.ignore(this.clouds.group)
    cameras.rtsGui.ignore(this.map.tiles.bg)
    cameras.rtsGui.ignore(this.map.tiles.bg2)
    cameras.rts.ignore(this.clouds.group)
    cameras.rts.ignore(gui.container)
    cameras.rts.ignore(gui.instructionText)
    cameras.rts.ignore(gui.costText)
    cameras.rtsGui.ignore(entities.enemies)
    cameras.rtsGui.ignore(entities.ground)
    cameras.rtsGui.ignore(entities.ground.state.container)
    cameras.rtsGui.ignore(entities.atlas)

    cameras.rts.ignore(gui.messageText)
    cameras.rtsGui.ignore(gui.messageText)

    cameras.rts.setZoom(2)

    this.input.setPollAlways()
    this.input.on('pointermove', this.onPointerMove, this)
    this.input.on('pointerup', this.onPointerUp, this)

    this.input.on('gameobjectup', this.onGameObjectUp.bind(this), this)
    this.input.on('gameobjectover', function (pointer, obj) {
      obj.setTint(0x00ff00)

      if (obj.frame.name in frameData) {
        gui.instructionText.setText([
          ...frameData[obj.frame.name].detail,
          ...ld.map(frameData[obj.frame.name].cost, (value, key) => (
            key + ': ' + String(value)
          ))
        ])
      } else {
        gui.instructionText.setText([':)'])
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

    this.physics.add.collider(entities.enemies, entities.atlas, this.die.bind(this), null, this)

    this.physics.add.collider(entities.atlas, this.map.tiles.bg)
    this.physics.add.collider(entities.atlas, entities.dynamic, entities.atlas.onDynamicCollide, null, entities.atlas)
    this.physics.add.collider(entities.dynamic, this.map.tiles.bg)
    this.physics.add.collider(entities.dynamic, entities.dynamic)
    this.physics.add.collider(entities.enemies, this.map.tiles.bg)
    this.physics.add.overlap(entities.enemies, entities.enemies, (a, b) => {
      if (a.enemyOverlap && b.enemyOverlap) {
        a.enemyOverlap.bind(a)(b)
        b.enemyOverlap.bind(b)(a)
      }
    })
    this.physics.add.collider(entities.statues, this.map.tiles.bg)
    // this.physics.add.collider(this.shooting.arrows, this.map.tiles.bg)

    this.physics.add.overlap(entities.atlas.targetter, entities.enemies, entities.atlas.onEnemyTargetterOverlap, null, entities.atlas)
    this.physics.add.collider(
      this.shooting.arrows,
      entities.enemies,
      (arrow, enemy) => {
        if (arrow.active && enemy.active) {
          arrow.kill()
          enemy.setActive(false)
          enemy.setVisible(false)
          enemy.body.enable = false
        }
      }
    )

    this.map.initializeEntities()
  }

  update (time, delta) {
    super.update(...arguments)

    if (this.state.DEAD) return
    this.clouds.update()

    const { gui, cameras, entities } = this.state

    gui.messageText.x = 0
    gui.messageText.visible = false
    // gui.messageText.y = entities.atlas.y
    // gui.messageText.setText(zone.message)

    this.physics.overlap(entities.atlas, entities.zones, this.onZoneOverlap, null, this)

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

  canBuyBuilding (data) {
    const { entities } = this.state
    const resources = this.data.get('resources')
    if (!data) {
      data = frameData[entities.ground.state.building.frame.name]
    }

    let canBuy = true

    ld.each(data.cost, (value, key) => {
      if (resources[key] < value) {
        canBuy = false
      }
    })

    return canBuy
  }

  onPointerMove (pointer) {
    const { gui, entities } = this.state
    const building = entities.ground.state.building

    building.visible = (pointer.y < 200 && pointer.x > 160 && pointer.x < 640)

    gui.costText.alpha = building.visible ? 1 : 0
    gui.costText.x = pointer.x
    gui.costText.y = pointer.y
    gui.costText.setText(
      ld.map(frameData[building.frame.name].cost, (value, key) => (
        key + ': ' + String(value)
      ))
    )
    if (!building.visible) return

    const canBuy = this.canBuyBuilding()
    if (canBuy) {
      building.clearTint()
    } else {
      building.setTint(0xff0000)
    }

    if (pointer.y < 200) {
      const ROUND_VALUE = 25

      const coord = (Phaser.Math.Clamp(pointer.x, 180, 600)) / 2
      const round = Math.round(coord / ROUND_VALUE) * ROUND_VALUE

      building.x = round - 200
    }
  }

  onPointerUp (pointer) {
    const { entities } = this.state

    const canBuy = this.canBuyBuilding()
    if (!canBuy) return;

    if (
      pointer.y < 200 && (pointer.x > 160 && pointer.x < 640)
    ) {
      
      const ROUND_VALUE = 25

      const coord = (Phaser.Math.Clamp(pointer.x, 200, 600)) / 2
      const round = Math.round(coord / ROUND_VALUE) * ROUND_VALUE
      const index = Math.round((round - 100) / 25)

      const buildings = entities.ground.state.buildings
      if (entities.ground.state.building.frame.name === 'structures15.png') {
        if (buildings[index]) {
          entities.ground.killBuilding(buildings[index])
        }
        return;
      }

      if (!buildings[index]) {
        const data = frameData[entities.ground.state.building.frame.name]
        const resources = this.data.get('resources')
        ld.each(data.cost, (value, key) => {
          resources[key] -= value
        })
        entities.ground.spawnBuilding(round, data)
      }
    }
  }

  onGameObjectUp (pointer, obj) {
    const { entities, gui } = this.state

    if (obj.isFaith) {
      return gui.showActions()
    }
    else if (obj.isBuildings) {
      return gui.showBuildings()
    }
    else if (obj.isSell) {
      entities.ground.startSale()
      gui.showSale()
    }

    switch(obj.frame.name) {
      case 'structures14.png':
        const data = frameData[obj.frame.name]
        if (this.canBuyBuilding(data)) {
          const resources = this.data.get('resources')
          ld.each(data.cost, (value, key) => {
            resources[key] -= value
          })
          const wood = new Wood(this, entities.atlas.x, entities.atlas.y - entities.atlas.height / 2)
          entities.dynamic.add(wood)
          this.add.existing(wood)
          wood.body.setVelocity(entities.atlas.flipX ? -100 : 100, 0)
        }
        return
    }

    entities.ground.state.building.setFrame(obj.frame.name)
  }

  onZoneOverlap (atlas, zone) {
    const { gui, entities, doneScripts } = this.state
    if (zone.message) {
      gui.messageText.visible = true
      gui.messageText.setOrigin(0, 0)
      gui.messageText.x = 0
      gui.messageText.y = -80
      gui.messageText.setScrollFactor(0, 0)
      gui.messageText.depth = this.depths.messages
      gui.messageText.setText(zone.message)
    }
    if (zone.script) {
      if (zone.script === 'fastShot') {
        entities.atlas.SHOT_TIMER_MAX = 60
      }
      if (zone.script === 'spawnGhosts') {
        if (doneScripts.spawnGhostsTimer <= 0) {
          const entity = this.enemies.spawn([
            entities.atlas.x + Phaser.Math.RND.integerInRange(-50, 50),
            entities.atlas.y - 800
          ], Ghost)
          if (entity) {
            doneScripts.spawnGhosts = true
            doneScripts.spawnGhostsTimer = Phaser.Math.RND.integerInRange(0, 100) + 400
          }
        } else {
          doneScripts.spawnGhostsTimer--
        }
      }
      if (zone.script === 'clearStores') {
        this.data.set('resources', {
          gold: 0,
          food: 0,
          wood: 0,
          stone: 0,
          prayer: 0
        })
      }
    }
  }

  die () {
    if (this.state.DEAD) return
    this._audio.sfx.hurt.play()

    this.state.DEAD = true
    this.cameras.main.fade(1000, 0, 0, 0)
    this.state.cameras.rts.fade(1000, 0, 0, 0)
    this.state.cameras.rtsGui.fade(1000, 0, 0, 0)
    this._choreoTimer = this.time.delayedCall(
      1000,
      () => {
        this._melody.stop()
        this.scene.start('MenuScene')
      }
    )
  }

  transitionOut () {
  }
}

export default GameScene
