export default class RTSGround extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)

    this.state = {
      building: this.addSprite(0, 0, 'entities', 'structures2.png'),
      person: this.addSprite(0, 0, 'entities', 'person1.png'),
      hoverPointer: this.addSprite(0, 0, 'entities', 'structures1.png')
    }
    this.children = [
      this.state.building,
      this.state.person,
      this.state.hoverPointer
    ]

    this.state.building.setInteractive()
    this.state.building.depth = this.depth + 0.001
    this.state.person.depth = this.depth + 0.001

    this.state.person.anims.play('person/walk')
  }

  addSprite (x, y, key, frame) {
    return this.scene.add.sprite(x, y, key, frame).setOrigin(0.5, 1)
  }

  onMouseOver (pointer, obj) {
    console.log(pointer, obj)
  }

  update () {
    super.update(...arguments)
    const { cameras, entities } = this.scene.state

    this.y = entities.atlas.y - 96

    this.state.building.x = this.x
    this.state.building.y = this.y + 20
    this.state.building.depth = this.depth + 0.001

    this.state.person.x = this.x
    this.state.person.y = this.y + 26
    this.state.person.depth = this.depth + 0.001
  }
}
