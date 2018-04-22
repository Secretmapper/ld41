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

    bg.setCollisionByProperty({ collides: true })
    bg2.setCollisionByProperty({ collides: true })

    this.map = map
    this.tiles = { bg, bg2 }
  }
}
