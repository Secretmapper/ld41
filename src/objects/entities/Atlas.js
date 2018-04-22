const VEL = 200

export default class Atlas extends Phaser.GameObjects.Sprite {
  constructor () {
    super(...arguments)
    this.scene.physics.world.enable(this)

    this.anims.play('atlas/idle')

    const KeyCodes = Phaser.Input.Keyboard.KeyCodes
    this.body.setSize(80, 130)
    this.controls = this.scene.input.keyboard.addKeys({
      up: KeyCodes.W,
      down: KeyCodes.S,
      left: KeyCodes.A,
      right: KeyCodes.D,
      jump: KeyCodes.SPACE
    })
  }

  update () {
    super.update(...arguments)

    this.body.setVelocityX(this.body.velocity.x * 0.95)
    if (this.controls.left.isDown) {
      this.body.setVelocityX(-VEL)
      this.flipX = true
      this.anims.play('atlas/walk', true)
    } else if (this.controls.right.isDown) {
      this.body.setVelocityX(VEL)
      this.flipX = false
      this.anims.play('atlas/walk', true)
    } else {
      this.anims.play('atlas/idle', true)
    }

    // if (Phaser.Input.Keyboard.JustDown(this.controls.jump)) {
    if (this.controls.jump.isDown) {
      this.jump()
    }

    this.scene.state.entities.ground.x = this.x
  }

  jump () {
    if (this.body.blocked.down || this.body.touching.down) {
      if (this.body.velocity.y < 0 || this.body.blocked.down || this.body.touching.down) {
        this.body.setVelocityY(-250)
      }
    }
  }
}
