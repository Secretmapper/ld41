import ResourceMaker from './ResourceMaker'

class RTSGround extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)

    this.state = {
      container: this.scene.add.container(0, 0),
      building: this.addSprite(0, 20, 'entities', 'structures2.png'),
      // person: this.addSprite(0, 26, 'entities', 'person1.png'),
      hoverPointer: this.addSprite(0, 0, 'entities', 'structures1.png'),
      buildings: [
        null,
        null,
        null,
        null,

        new ResourceMaker(this.scene, 0, 20, 'entities', 'structures11.png'),
        null,
        null,
        null,

        null
      ]
    }

    this.state.hoverPointer.alpha = 0
    this.state.building.alpha = 0.5
    this.state.building.visible = false

    this.state.container.add(this)
    this.state.container.add(this.state.buildings[4])
    this.state.container.add(this.state.building)
    // this.state.container.add(this.state.person)

    this.state.container.add(this.state.buildings[4].gui)
    this.state.container.add(this.state.hoverPointer)

    // this.state.person.anims.play('person/walk')
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
    const textureFrame = this.scene.state.entities.atlas.anims.currentFrame.textureFrame

    this.x = 0
    this.y = textureFrame === 'atlas3.png' || textureFrame === 'atlas7.png' ? 1 : 0

    this.state.container.x = entities.atlas.x
    this.state.container.y = entities.atlas.y - 96 + this.y
  }

  spawnBuilding (x) {
    const index = Math.round((x - 100) / 25)

    if (!this.state.buildings[index]) {
      const sp = new ResourceMaker(
        this.scene,
        x - 200,
        20,
        'entities',
        this.state.building.frame.name
      )
      sp.setOrigin(0.5, 1)

      this.state.buildings[index] = sp
      this.state.container.add(sp)
      this.state.container.add(sp.gui)
    }
  }
}

export default RTSGround
