import Chaser from '../objects/entities/Chaser'

const resolveEntityClass = name => {
  return ({
    'Chaser': Chaser
  })[name]
}

export default class Map {
  constructor (scene) {
    this.scene = scene
    this.scene.map = this

    const key = 'map'
    const map = this.scene.make.tilemap({ key })
    const tileset = map.addTilesetImage('tiles')

    const bg = map.createStaticLayer('bg', tileset, 0, 0)
    const bg2 = map.createStaticLayer('bg2', tileset, 0, 0)
    bg.setScale(2)
    bg2.setScale(2)

    bg.depth = 1
    bg2.depth = 1

    bg.setCollisionByProperty({ collides: true })
    bg2.setCollisionByProperty({ collides: true })

    this.map = map
    this.tiles = { bg, bg2 }
  }

  initializeEntities () {
    for (let layer = 0; layer < this.map.objects.length; layer++) {
      for (let i = 0; i < this.map.objects[layer].objects.length; i++) {
        let obj = this.map.objects[layer].objects[i]
        if (obj.name === 'Zone') {
          const zone = this.scene.add.zone(obj.x * 2, obj.y * 2, obj.width * 2, obj.height * 2)
          this.scene.state.entities.zones.add(zone)

          zone.message = obj.properties.text
          zone.script = obj.properties.script
          zone.body.allowGravity = false
        } else {
          const classType = resolveEntityClass(obj.name)

          if (classType) {
            const entity = this.scene.enemies.spawn([obj.x * 2, obj.y * 2], classType)
          } else {
            if (obj.name === 'StatueAres') {
              const entity = this.scene.add.sprite(obj.x * 2, obj.y * 2, 'entities', 'statues1.png')
              this.scene.state.entities.statues.add(entity)
            } else if (obj.name === 'StatueAthena') {
              const entity = this.scene.add.sprite(obj.x * 2, obj.y * 2, 'entities', 'statues2.png')
              this.scene.state.entities.statues.add(entity)
            }
          }
        }
      }
    }
  }
}
