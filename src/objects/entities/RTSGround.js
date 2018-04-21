export default class RTSGround extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)

    this.state = {
      container: this.scene.add.container(0, 0),
      building: this.addSprite(0, 20, 'entities', 'structures2.png'),
      person: this.addSprite(0, 26, 'entities', 'person1.png'),
      hoverPointer: this.addSprite(0, 0, 'entities', 'structures1.png')
    }

    this.state.hoverPointer.alpha = 0

    this.state.container.add(this)
    this.state.container.add(this.state.building)
    this.state.container.add(this.state.person)
    this.state.container.add(this.state.hoverPointer)

    this.state.person.anims.play('person/walk')
  }

  addSprite (x, y, key, frame) {
    return this.scene.add.sprite(x, y, key, frame).setOrigin(0.5, 1)
  }

  onMouseOver (pointer, gameObject) {
    gameObject.setTint(0xff0000)
  }

  onMouseOut (pointer, gameObject) {
    gameObject.clearTint()
  }

  update () {
    super.update(...arguments)
    const { cameras, entities } = this.scene.state
    this.x = 0
    this.y = 0

    this.state.container.x = entities.atlas.x
    this.state.container.y = entities.atlas.y - 96
  }
}
