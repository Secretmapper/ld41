export default class RTSGround extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)

    this.state = {
      container: this.scene.add.container(0, 0),
      building: this.scene.add.sprite(0, 0, 'entities', 'structures1.png'),
      person: this.scene.add.sprite(0, 0, 'entities', 'person1.png')
    }

    // this.state.container.add(this.state.building)
    // this.state.container.x = this.x 
    // this.state.container.y = this.y
  }

  update () {
    super.update(...arguments)
    const { cameras, entities } = this.scene.state

    this.y = entities.atlas.y - 48

    this.state.building.x = this.x
    this.state.building.y = this.y
    this.state.building.depth = this.depth + 0.001

    this.state.person.x = this.x
    this.state.person.y = this.y + 10
    this.state.person.depth = this.depth + 0.001
  }
}
