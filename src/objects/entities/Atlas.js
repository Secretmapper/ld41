const VEL = 100

export default class Atlas extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)

    this.anims.play('atlas/idle')

    const KeyCodes = Phaser.Input.Keyboard.KeyCodes
    this.controls = this.scene.input.keyboard.addKeys({
      up: KeyCodes.UP,
      down: KeyCodes.DOWN,
      left: KeyCodes.LEFT,
      right: KeyCodes.RIGHT
    })
  }

  update () {
    super.update(...arguments)

    this.body.setVelocity(0)
    if (this.controls.left.isDown) {
      this.body.setVelocity(-VEL, 0)
      this.flipX = true
      this.anims.play('atlas/walk', true)
    } else if (this.controls.right.isDown) {
      this.body.setVelocity(VEL, 0)
      this.flipX = false
      this.anims.play('atlas/walk', true)
    } else {
      this.anims.play('atlas/idle', true)
    }

    this.scene.state.entities.buildings.x = this.x
  }
}
