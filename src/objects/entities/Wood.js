export default class Wood extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'entities', 'structures14.png')
    this.scene.physics.world.enable(this)
    this.body.setSize(24, 24)
    this.setScale(3)
  }

  update () {
    super.update(...arguments)
    if (
      this.body.blocked.left
      || this.body.blocked.right
      || this.body.blocked.down
      || this.body.touching.down
    ) {
      this.body.setVelocityX(0)
    }
  }
}
