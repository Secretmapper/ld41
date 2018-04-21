const VEL = 100

export default class Atlas extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)

    this.anims.play('atlas/idle')

    const KeyCodes = Phaser.Input.Keyboard.KeyCodes
    this.controls = this.scene.input.keyboard.addKeys({
      up: KeyCodes.W,
      down: KeyCodes.S,
      left: KeyCodes.A,
      right: KeyCodes.D
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

    this.scene.state.entities.ground.x = this.x
  }
}
